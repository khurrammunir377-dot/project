import asyncio
import os
from playwright.async_api import async_playwright

BASE_URL = "https://kmbnexora.vercel.app"
OUT_DIR = r"e:\Company App\presentation_assets\screenshots"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

PAGES = [
    {"name": "01_landing.png", "path": "/", "auth": False},
    {"name": "02_login.png", "path": "/login", "auth": False},
    {"name": "03_dashboard.png", "path": "/dashboard", "auth": True},
    {"name": "04_invoices.png", "path": "/sales/invoices", "auth": True},
    {"name": "05_quotations.png", "path": "/sales/quotations", "auth": True},
    {"name": "06_warehouses.png", "path": "/inventory/warehouses", "auth": True},
    {"name": "07_products.png", "path": "/inventory/products", "auth": True},
    {"name": "08_payroll.png", "path": "/hr/payroll", "auth": True},
    {"name": "09_attendance.png", "path": "/hr/attendance", "auth": True},
    {"name": "10_marketing.png", "path": "/reports/marketing", "auth": True},
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path=CHROME_PATH,
            headless=True,
            args=["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"]
        )
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1.25
        )
        page = await context.new_page()

        print("Setting up authentication...")
        await page.goto(f"{BASE_URL}/login", wait_until="networkidle")
        await page.evaluate("() => localStorage.setItem('nexora_auth_user', 'usr-1')")
        await asyncio.sleep(1)

        for item in PAGES:
            target_url = f"{BASE_URL}{item['path']}"
            print(f"Capturing {item['name']} from {target_url}...")
            if not item['auth']:
                # clear auth if needed for landing/login
                await page.evaluate("() => localStorage.removeItem('nexora_auth_user')")
            else:
                await page.evaluate("() => localStorage.setItem('nexora_auth_user', 'usr-1')")
            
            await page.goto(target_url, wait_until="networkidle")
            await asyncio.sleep(2)  # wait for animations/charts to render
            out_file = os.path.join(OUT_DIR, item['name'])
            await page.screenshot(path=out_file, full_page=False)
            print(f"Saved {out_file}")

        await browser.close()
        print("All screenshots captured successfully!")

if __name__ == "__main__":
    asyncio.run(main())
