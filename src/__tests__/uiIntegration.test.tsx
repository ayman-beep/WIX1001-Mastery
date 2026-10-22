import { act } from 'react';
import ReactDOM from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';

// Enable React 18 act environment in Vitest jsdom
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function setNativeTextareaValue(textarea: HTMLTextAreaElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    'value'
  )?.set;
  setter?.call(textarea, value);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('6. Full UI End-to-End Integration & Persistence Verification', () => {
  let container: HTMLDivElement;
  let root: ReactDOM.Root;

  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '#/dashboard';
    window.scrollTo = () => {};
    container = document.createElement('div');
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('opens Phase 1 with Expected Answer + Input + Live Preview, completes warmup, enforces 0/3 reset, and persists across reload', () => {
    act(() => {
      root.render(<App />);
    });

    // Verify all 14 weeks appear in the rendered sidebar
    for (let w = 1; w <= 14; w++) {
      expect(container.textContent).toContain(`W${w}:`);
    }

    const getTextarea = () =>
      container.querySelector('#drill-answer-textarea') as HTMLTextAreaElement;

    // Click "Continue Studying" on Dashboard -> opens Card w01-01 ("{1, 2, 3, 4, ...}")
    const continueBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Continue Studying')
    )!;
    expect(continueBtn).toBeTruthy();

    act(() => {
      continueBtn.click();
    });

    // Phase 1: Expected answer AND interactive input + Live Preview are ALL visible immediately!
    expect(container.textContent).toContain('Phase 1 · Study Complete Expected Answer');
    expect(container.textContent).toContain('{1, 2, 3, 4, ...}');
    expect(container.textContent).toContain('Live Preview');
    expect(getTextarea()).toBeTruthy();

    // Type the target answer in Phase 1 warmup -> Live Preview & Exact Match badge appear immediately
    act(() => {
      setNativeTextareaValue(getTextarea(), '{1, 2, 3, 4, ...}');
    });
    expect(container.textContent).toContain('Exact Match! Press Enter to Start 0 / 3 Recall');

    // Submit the guided warmup rep -> transitions to Phase 2 with expected answer now hidden at 0 / 3!
    const submitWarmupBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Practice Done → Start 0 / 3 Recall')
    )!;
    act(() => {
      submitWarmupBtn.click();
    });

    // Phase 2: Expected answer is now hidden; streak begins at 0 / 3
    expect(container.textContent).not.toContain('Phase 1 · Study Complete Expected Answer');
    expect(container.textContent).toContain('Streak: 0 / 3');

    const getVerifyBtn = () =>
      Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Verify Repetition')
      )!;

    // Test symbol toolbar cursor insertion at exact cursor position
    act(() => {
      const ta = getTextarea();
      setNativeTextareaValue(ta, 'AB');
      ta.setSelectionRange(1, 1);
      const interBtn = container.querySelector('button[aria-label="Intersection"]') as HTMLButtonElement;
      interBtn.click();
    });
    expect(getTextarea().value).toBe('A∩B');

    // Submit 1st correct repetition -> Streak becomes 1 / 3
    act(() => {
      setNativeTextareaValue(getTextarea(), '{1, 2, 3, 4, ...}');
    });
    act(() => {
      getVerifyBtn().click();
    });
    expect(container.textContent).toContain('Streak: 1 / 3');

    // Submit an incorrect answer -> Mistake Modal appears & resets streak to 0 / 3
    act(() => {
      setNativeTextareaValue(getTextarea(), '{0, 1, 2, 3, ...}');
    });
    act(() => {
      getVerifyBtn().click();
    });
    expect(container.textContent).toContain('Incorrect Answer — Streak Reset to 0 / 3');
    expect(container.textContent).toContain('{0, 1, 2, 3, ...}');
    expect(container.textContent).toContain('{1, 2, 3, 4, ...}');

    const tryAgainBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Try Again')
    )!;
    act(() => {
      tryAgainBtn.click();
    });
    expect(container.textContent).toContain('Streak: 0 / 3');

    // Now complete 3 consecutive exact repetitions (0/3 -> 1/3 -> 2/3 -> 3/3)
    for (let rep = 0; rep < 3; rep++) {
      act(() => {
        setNativeTextareaValue(getTextarea(), '{1, 2, 3, 4, ...}');
      });
      act(() => {
        getVerifyBtn().click();
      });
    }

    // Phase 4: Card is completed & placed in Leitner Box 1
    expect(container.textContent).toContain('3 / 3 Consecutive Repetitions Complete — Card Mastered!');
    expect(container.textContent).toContain('Leitner Box 1');

    // Simulate full browser reload by unmounting and mounting a brand-new React root!
    act(() => {
      root.unmount();
    });
    window.location.hash = '#/dashboard';
    root = ReactDOM.createRoot(container);
    act(() => {
      root.render(<App />);
    });

    // Sidebar W1 should immediately show 1 mastered card persisted across browser reload!
    expect(container.textContent).toContain('1 mast.');
  });
});
