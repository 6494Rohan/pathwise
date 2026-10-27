const { withMainActivity } = require('expo/config-plugins');

const MARKER = 'setupImeInsets';

const IMPORTS = `import android.view.View
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding
`;

const ON_CREATE_CALL = `
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      setupImeInsets()
    }`;

const MEMBERS = `  private var isImeAnimating = false

  // Edge-to-edge (targetSdk 36) stops adjustResize from shrinking the window, so pad the root by the keyboard height.
  private fun imeBottomOf(insets: WindowInsetsCompat): Int =
    if (insets.isVisible(WindowInsetsCompat.Type.ime())) {
      insets.getInsets(WindowInsetsCompat.Type.ime()).bottom
    } else {
      0
    }

  private fun setupImeInsets() {
    val rootView: View = findViewById(android.R.id.content)

    ViewCompat.setOnApplyWindowInsetsListener(rootView) { v, insets ->
      // While the keyboard animates, onProgress drives the padding; applying it here too would snap the layout.
      if (!isImeAnimating) {
        v.updatePadding(bottom = imeBottomOf(insets))
      }
      insets
    }

    ViewCompat.setWindowInsetsAnimationCallback(
      rootView,
      object : WindowInsetsAnimationCompat.Callback(DISPATCH_MODE_CONTINUE_ON_SUBTREE) {
        override fun onPrepare(animation: WindowInsetsAnimationCompat) {
          if (animation.typeMask and WindowInsetsCompat.Type.ime() != 0) {
            isImeAnimating = true
          }
        }

        override fun onProgress(
          insets: WindowInsetsCompat,
          runningAnimations: MutableList<WindowInsetsAnimationCompat>
        ): WindowInsetsCompat {
          rootView.updatePadding(bottom = imeBottomOf(insets))
          return insets
        }

        override fun onEnd(animation: WindowInsetsAnimationCompat) {
          if (animation.typeMask and WindowInsetsCompat.Type.ime() != 0) {
            isImeAnimating = false
            ViewCompat.requestApplyInsets(rootView)
          }
        }
      }
    )
  }

`;

const insertAfter = (source, anchor, addition) => {
  if (!source.includes(anchor)) {
    throw new Error(`withAndroidImeInsets: could not find "${anchor.trim()}" in MainActivity.kt`);
  }
  return source.replace(anchor, `${anchor}${addition}`);
};

const insertBefore = (source, anchor, addition) => {
  if (!source.includes(anchor)) {
    throw new Error(`withAndroidImeInsets: could not find "${anchor.trim()}" in MainActivity.kt`);
  }
  return source.replace(anchor, `${addition}${anchor}`);
};

const addImeInsets = (source) => {
  if (source.includes(MARKER)) return source;

  let result = insertAfter(source, 'import android.os.Bundle\n', IMPORTS);
  result = insertAfter(result, '    super.onCreate(null)', ON_CREATE_CALL);
  return insertBefore(result, '  /**\n   * Returns the name of the main component', MEMBERS);
};

const withAndroidImeInsets = (config) =>
  withMainActivity(config, (mod) => {
    if (mod.modResults.language !== 'kt') {
      throw new Error('withAndroidImeInsets: only a Kotlin MainActivity is supported');
    }
    mod.modResults.contents = addImeInsets(mod.modResults.contents);
    return mod;
  });

module.exports = withAndroidImeInsets;
module.exports.addImeInsets = addImeInsets;
