"""Generate the deterministic stress fixture used only by the browser QA harness."""
from pathlib import Path
import random
from PIL import Image
path = Path(__file__).resolve().parents[1] / 'tests/fixtures/large.jpg'
image = Image.frombytes('RGB', (3200, 2400), random.Random(42).randbytes(3200 * 2400 * 3))
image.save(path, quality=85)
print(path)
