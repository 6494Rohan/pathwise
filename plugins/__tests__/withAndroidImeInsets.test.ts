import { addImeInsets } from '../withAndroidImeInsets';

const mainActivity = `package com.example

import android.os.Build
import android.os.Bundle

import com.facebook.react.ReactActivity

class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    setTheme(R.style.AppTheme);
    super.onCreate(null)
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "main"
}
`;

describe('withAndroidImeInsets', () => {
  it('pads the root view by the keyboard height from onCreate', () => {
    const result: string = addImeInsets(mainActivity);

    expect(result).toContain('import androidx.core.view.WindowInsetsAnimationCompat');
    expect(result).toContain('super.onCreate(null)\n    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {\n      setupImeInsets()');
    expect(result.indexOf('private fun setupImeInsets()')).toBeLessThan(result.indexOf('override fun getMainComponentName'));
  });

  it('applies only once', () => {
    const once: string = addImeInsets(mainActivity);

    expect(addImeInsets(once)).toBe(once);
  });

  it('fails loudly when the template changes', () => {
    expect(() => addImeInsets('class MainActivity')).toThrow('could not find');
  });
});
