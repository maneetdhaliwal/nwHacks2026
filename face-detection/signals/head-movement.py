# signals/head_movement.py
import numpy as np

class HeadMovementTracker:
    def __init__(self):
        self.positions = []

    def update(self, face_landmarks):
        nose = face_landmarks.landmark[1]
        pos = np.array([nose.x, nose.y])

        self.positions.append(pos)
        if len(self.positions) > 10:
            self.positions.pop(0)

        if len(self.positions) < 2:
            return 0

        return np.linalg.norm(self.positions[-1] - self.positions[0])


