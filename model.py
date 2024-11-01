import torch
import torch.nn as nn
import torchvision.models as models

class ResNet3Class(nn.Module):
    def __init__(self):
        super(ResNet3Class, self).__init__()
        # Load a pretrained ResNet-50 model
        self.model = models.resnet50(pretrained=True)

        # Modify the last fully connected layer to output 3 classes
        num_ftrs = self.model.fc.in_features
        self.model.fc = nn.Linear(num_ftrs, 3)

    def forward(self, x):
        # Forward pass through the ResNet model
        x = self.model(x)
        return nn.functional.softmax(x, dim=1)