import cv2
from PIL import Image
import numpy as np
from collections import Counter
import torch
from torchvision import transforms
from model import ResNet3Class
from concurrent.futures import ThreadPoolExecutor
import requests
import time

# Load the trained model and set it to evaluation mode
model = ResNet3Class()
print("Loading model weights...")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.load_state_dict(torch.load('resnet3class_model.pth', map_location=device))
model.to(device)
model.eval()
classes = ['metal', 'paper', 'plastic']

# Define transformations
data_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Initialize the webcam
cap = cv2.VideoCapture(0)  # 0 is usually the default webcam; use 1 or higher if you have multiple webcams

# Shared variable for displaying the current label
current_label = "Loading..."

prev_time = time.time()
fps = 0
# Flag to stop threads gracefully
stop_flag = False

# Number of frames to consider for label calculation
t = 50  # Example: 100 frames
labels = []  # Stores labels of the last t frames

def classify_frame(img):
    """Classify the current frame and store the label in labels."""
    try:
        img = data_transforms(Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))).unsqueeze(0)
        img = img.to(device)
        with torch.no_grad():
            outputs = model(img)
            _, preds = torch.max(outputs, 1)
        
        label = preds.item()
        print(f"Predicted label: {classes[label]}")
        labels.append(str(label))
        if len(labels) > t:
            labels.pop(0)  # Keep only the last t frames

        # Check if any label appears in more than 90% of the last t frames
        label_counts = Counter(labels)
        most_common_label, count = label_counts.most_common(1)[0]

        if count / t > 0.8:
            # Send the label to a server endpoint if it appears >80% in recent frames
            try:
                response = requests.post('https://iot-smart-garbage-can.vercel.app/trash/', json={'label': most_common_label})
                if response.status_code == 200:
                    print(f'Successfully sent label to server: {most_common_label}')
                else:
                    print(f'Failed to send label to server: {response.status_code}')
            except Exception as e:
                print(f'Error sending label to server: {e}')
            labels.clear()
        
        return classes[label]
    
    
    except Exception as e:
        print(f"Error in classifying frame: {e}")

while not stop_flag:
    try:
        # Đọc dữ liệu hình ảnh từ URL
        # img_resp = urllib.request.urlopen(camera_url)
        # img_array = np.array(bytearray(img_resp.read()), dtype=np.uint8)
        # img = cv2.imdecode(img_array, -1)
        # img = cv2.flip(img, 0) # Lật hình ảnh theo chiều dọc
        ret, img = cap.read()

        # Kiểm tra nếu hình ảnh không đọc được
        if img is None:
            print("Không thể đọc được hình ảnh từ camera.")
            # executor.shutdown(wait=False)
            break

        # Tính FPS
        current_time = time.time()
        fps = 1 / (current_time - prev_time)
        prev_time = current_time

        # Khởi chạy phân loại frame trong một luồng song song
        current_label = classify_frame(img)

        # Hiển thị FPS trên frame
        cv2.putText(img, f'FPS: {fps:.2f}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 
                    1, (0, 255, 0), 2, cv2.LINE_AA)
        cv2.putText(img, current_label, (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 
                    1, (0, 0, 255), 2, cv2.LINE_AA)
        cv2.imshow('WiFi Camera Stream', img)

        # Thoát bằng cách nhấn phím 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            # executor.shutdown(wait=False)
            stop_flag = True
            break

    except Exception as e:
        print(f"Lỗi khi đọc hình ảnh hoặc xử lý: {e}")
        break

# Đóng kết nối và giải phóng tài nguyên
# esp_socket.close()
# tcp_server.close()
cv2.destroyAllWindows()
