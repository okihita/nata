import { chromium } from "playwright";

/**
 * Automated headful demo walkthrough with visual cursor emulation & click ripples.
 * Perfect for screen recording (OBS, QuickTime, Screen Studio) for hackathon demo videos.
 */
async function runDemo() {
  console.log("Launching visible Chrome window with human-like cursor emulation...");
  const browser = await chromium.launch({
    headless: false,
    slowMo: 400,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  // Inject visual cursor pointer and radiating click ripple
  await page.addInitScript(() => {
    window.addEventListener("DOMContentLoaded", () => {
      const cursor = document.createElement("div");
      cursor.id = "playwright-visual-mouse";
      cursor.style.position = "fixed";
      cursor.style.top = "0px";
      cursor.style.left = "0px";
      cursor.style.width = "20px";
      cursor.style.height = "20px";
      cursor.style.borderRadius = "50%";
      cursor.style.backgroundColor = "rgba(239, 68, 68, 0.85)";
      cursor.style.border = "2px solid #ffffff";
      cursor.style.boxShadow = "0 2px 8px rgba(0,0,0,0.4)";
      cursor.style.pointerEvents = "none";
      cursor.style.zIndex = "999999";
      cursor.style.transition = "transform 0.08s ease-out, background-color 0.15s";
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      document.body.appendChild(cursor);

      window.addEventListener("mousemove", (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      });

      window.addEventListener("mousedown", (e) => {
        cursor.style.transform = "translate(-50%, -50%) scale(0.75)";
        cursor.style.backgroundColor = "rgba(16, 185, 129, 0.95)";

        const ripple = document.createElement("div");
        ripple.style.position = "fixed";
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        ripple.style.width = "40px";
        ripple.style.height = "40px";
        ripple.style.borderRadius = "50%";
        ripple.style.border = "3px solid rgba(16, 185, 129, 0.9)";
        ripple.style.transform = "translate(-50%, -50%) scale(0.2)";
        ripple.style.pointerEvents = "none";
        ripple.style.zIndex = "999998";
        ripple.style.transition = "transform 0.4s ease-out, opacity 0.4s ease-out";
        document.body.appendChild(ripple);

        requestAnimationFrame(() => {
          ripple.style.transform = "translate(-50%, -50%) scale(1.6)";
          ripple.style.opacity = "0";
        });

        setTimeout(() => ripple.remove(), 450);
      });

      window.addEventListener("mouseup", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursor.style.backgroundColor = "rgba(239, 68, 68, 0.85)";
      });
    });
  });

  async function smoothMoveTo(x, y, steps = 18) {
    await page.mouse.move(x, y, { steps });
  }

  async function humanClick(locator) {
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    if (!box) return;
    const targetX = box.x + box.width / 2;
    const targetY = box.y + box.height / 2;

    await smoothMoveTo(targetX, targetY, 22);
    await page.waitForTimeout(180);
    await page.mouse.down();
    await page.waitForTimeout(120);
    await page.mouse.up();
    await page.waitForTimeout(250);
  }

  console.log("Navigating to http://localhost:48701/routines...");
  await page.goto("http://localhost:48701/routines");
  await page.waitForLoadState("networkidle");

  await smoothMoveTo(500, 300, 15);
  await page.waitForTimeout(1500);

  // 1. Move cursor smoothly to 'Create Routine' button and click
  console.log("Clicking 'Create Routine'...");
  const createBtn = page.getByRole("button", { name: /create routine|buat rutinitas/i }).first();
  await humanClick(createBtn);

  // 2. Pause to observe the prefilled Jury Demo modal
  console.log("Observing prefilled Jury Demo modal...");
  await page.waitForTimeout(2200);

  const promptInput = page.locator("textarea").first();
  if (await promptInput.isVisible()) {
    const box = await promptInput.boundingBox();
    if (box) await smoothMoveTo(box.x + 80, box.y + 40, 20);
  }
  await page.waitForTimeout(1200);

  // 3. Move cursor to 'Schedule Routine' button and click
  console.log("Clicking 'Schedule Routine'...");
  const scheduleBtn = page.getByRole("button", { name: /schedule routine|jadwalkan rutinitas/i });
  await humanClick(scheduleBtn);

  // 4. Wait for scheduled job to appear in Pane 1 and trigger initial run
  console.log("Observing live routine creation in timeline...");
  await page.waitForTimeout(2500);

  // 5. Move cursor to select the newly created routine card
  console.log("Selecting scheduled routine...");
  const routineCard = page.locator("text=Hackathon Demo").first();
  if (await routineCard.isVisible()) {
    await humanClick(routineCard);
  }
  await page.waitForTimeout(2000);

  // 6. Move cursor to 'Run Now' button and click to trigger live execution
  console.log("Clicking 'Run Now' button...");
  const runNowBtn = page.getByRole("button", { name: /run now|jalankan sekarang/i }).first();
  if (await runNowBtn.isVisible()) {
    await humanClick(runNowBtn);
  }

  // 7. Watch the execution run, token metrics, and artifact recalculation
  console.log("Observing live ADK execution and ledger recomputation...");
  await page.waitForTimeout(6000);

  console.log("Demo flow finished successfully. Closing browser...");
  await browser.close();
}

runDemo().catch((err) => {
  console.error("Demo walkthrough error:", err);
  process.exit(1);
});
