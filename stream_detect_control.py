import cv2
from PIL import Image
import urllib.request
import numpy as np
import socket
import time
from collections import Counter
import torch
from torchvision import transforms
from model import ResNet3Class

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

# URL của camera WiFi
camera_url = 'http://192.168.66.220/cam-hi.jpg'

# Thiết lập TCP server
HOST = '0.0.0.0'  # Lắng nghe trên tất cả các địa chỉ IP
PORT = 3000       # Port mà ESP8266 sẽ kết nối

# Tạo socket TCP
# tcp_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# tcp_server.bind((HOST, PORT))
# tcp_server.listen(1)  # Lắng nghe một kết nối từ ESP8266

# print(f"TCP server is listening on {HOST}:{PORT}...")

# # Chấp nhận kết nối từ ESP8266
# esp_socket, addr = tcp_server.accept()
# print(f"ESP8266 connected from {addr}")

# Khởi tạo thời gian bắt đầu và số khung hình để tính FPS
prev_time = time.time()
fps = 0

# Số lượng frame cần tính toán (t)
t = 100  # Ví dụ: 100 frame
labels = []  # Lưu trữ các nhãn của t frame gần nhất

# Shared variable for displaying the current label
current_label = "Loading..."

# Flag to stop threads gracefully
stop_flag = False

def classify_frame(img):
    try:
        img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        img = data_transforms(img).unsqueeze(0).to(device)
        # Chạy phân loại
        with torch.no_grad():
            outputs = model(img)
            _, preds = torch.max(outputs, 1)
        
        # Lấy nhãn dự đoán
        label = preds.item()
        print(f"Predicted label: {classes[label]}")
        labels.append(str(label))
        if len(labels) > t:
            labels.pop(0)  # Giữ lại đúng t frame

        # Kiểm tra xem nhãn nào chiếm trên 90% trong t frame gần nhất
        label_counts = Counter(labels)
        most_common_label, count = label_counts.most_common(1)[0]

        if count / t > 0.9:
            # Gửi nhãn đến ESP8266 nếu nhãn chiếm hơn 90%
            # esp_socket.sendall((most_common_label + '\n').encode())
            print(f'Sent label to ESP8266: {most_common_label}')
            labels.clear()
        
        # Update the displayed label
        return classes[label]
    
    except Exception as e:
        print(f"Lỗi khi phân loại frame: {e}")
        raise

# Khởi động camera
cap = cv2.VideoCapture(0)  # Sử dụng camera mặc định

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