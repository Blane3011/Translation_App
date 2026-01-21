document.addEventListener("DOMContentLoaded", ()=>{

  const fontSlider = document.getElementById("fontSizeSlider");
  const fontLabel = document.getElementById("fontSizeValue");
  const lineSlider = document.getElementById("lineHeightSlider");
  const lineLabel = document.getElementById("lineHeightValue");

  const themeToggle = document.getElementById("themeToggle");
  const contrastToggle = document.getElementById("contrastToggle");
  const motionToggle = document.getElementById("motionToggle");
  const resetBtn = document.getElementById("resetAccessibility");

  const { applyFontSize, applyLineHeight, applyTheme, applyContrast, applyReducedMotion } = window.applySettings;

  function initSlider(label, slider, key, applyFunc, defaultValue){
    const value = window.Settings.get(key, defaultValue);
    slider.value = value;
    label.textContent = value;
    applyFunc(Number(value));
    slider.addEventListener("input", ()=>{
      applyFunc(Number(slider.value));
      label.textContent = Number(slider.value).toFixed(2);
      window.Settings.set(key, Number(slider.value));
    });
  }

  
  initSlider(fontLabel, fontSlider, "fontSize", applyFontSize, 16);
  initSlider(lineLabel, lineSlider, "lineHeight", applyLineHeight, 1.4);

  // Dark mode toggle
  themeToggle.checked = window.Settings.get("darkMode", true);
  themeToggle.addEventListener("change", ()=>{
    applyTheme(themeToggle.checked);
    window.Settings.set("darkMode", themeToggle.checked);
  });

  // High contrast toggle
  contrastToggle.checked = window.Settings.get("highContrast", false);
  contrastToggle.addEventListener("change", ()=>{
    applyContrast(contrastToggle.checked);
    window.Settings.set("highContrast", contrastToggle.checked);
  });

  // Reduce motion toggle
  motionToggle.checked = window.Settings.get("reduceMotion", false);
  motionToggle.addEventListener("change", ()=>{
    applyReducedMotion(motionToggle.checked);
    window.Settings.set("reduceMotion", motionToggle.checked);
  });

  // Reset button
  resetBtn.addEventListener("click", ()=>{
    fontSlider.value = 16; applyFontSize(16); window.Settings.set("fontSize",16); fontLabel.textContent=16;
    lineSlider.value = 1.4; applyLineHeight(1.4); window.Settings.set("lineHeight",1.4); lineLabel.textContent=1.4;
    themeToggle.checked = true; applyTheme(true); window.Settings.set("darkMode",true);
    contrastToggle.checked = false; applyContrast(false); window.Settings.set("highContrast",false);
    motionToggle.checked = false; applyReducedMotion(false); window.Settings.set("reduceMotion",false);
  });
});