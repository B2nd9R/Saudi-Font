document.addEventListener('DOMContentLoaded', function() {
    // عناصر DOM
    const textInput = document.getElementById('textInput');
    const outputText = document.getElementById('outputText');
    const outputContainer = document.getElementById('outputContainer');
    const fontStyleSelect = document.getElementById('fontStyle');
    const fontSizeSlider = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const textColorPicker = document.getElementById('textColor');
    const bgColorPicker = document.getElementById('bgColor');
    const textAlignSelect = document.getElementById('textAlign');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // اللون الأخضر السعودي الافتراضي
    const defaultGreenColor = "#006c35";
    
    // ضبط اللون الافتراضي للنص
    textColorPicker.value = defaultGreenColor;
    outputText.style.color = defaultGreenColor;
    
    // تحديث المخرجات
    function updateOutput() {
        outputText.textContent = textInput.value || ' ';  // إذا كان فارغاً، نضع مسافة للحفاظ على الارتفاع
    }
    
    // تحديث نمط الخط
    function updateFontStyle() {
        outputText.style.fontFamily = `'${fontStyleSelect.value}', Arial, sans-serif`;
    }
    
    // تحديث حجم الخط
    function updateFontSize() {
        const size = fontSizeSlider.value;
        outputText.style.fontSize = `${size}px`;
        fontSizeValue.textContent = `${size}px`;
    }
    
    // تحديث لون النص
    function updateTextColor() {
        outputText.style.color = textColorPicker.value;
    }
    
    // تحديث لون الخلفية
    function updateBgColor() {
        outputContainer.style.backgroundColor = bgColorPicker.value;
    }
    
    // تحديث محاذاة النص
    function updateTextAlign() {
        outputText.style.textAlign = textAlignSelect.value;
    }
    
    // تنزيل النص كصورة
    function downloadAsImage() {
        // التحقق من وجود نص
        if (!textInput.value.trim()) {
            alert("الرجاء إدخال نص قبل التنزيل");
            return;
        }
        
        // التأكد من تحميل الخط قبل الرسم
        document.fonts.ready.then(() => {
            // إنشاء عنصر canvas مؤقت
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // معامل التكبير لزيادة الدقة (يمكن زيادته للحصول على صورة أكثر وضوحًا)
            const scaleFactor = 2;
            
            // تعيين أبعاد الـ canvas مع معامل التكبير
            const padding = 40;  // هامش حول النص
            const containerWidth = outputContainer.offsetWidth - (padding * 2);
            const containerHeight = Math.max(outputContainer.offsetHeight, 200) - (padding * 2);
            canvas.width = (containerWidth + (padding * 2)) * scaleFactor;
            canvas.height = (containerHeight + (padding * 2)) * scaleFactor;
            
            // تطبيق معامل التكبير على السياق
            ctx.scale(scaleFactor, scaleFactor);
            
            // تحسين جودة الرسم
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // رسم الخلفية
            ctx.fillStyle = bgColorPicker.value;
            ctx.fillRect(0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);
            
            // الحصول على الخط الحالي
            const currentFont = fontStyleSelect.value;
            const fontSizePx = fontSizeSlider.value;
            const textColor = textColorPicker.value;
            
            // إعداد النص
            ctx.fillStyle = textColor;
            ctx.font = `${fontSizePx}px ${currentFont}`;
            ctx.textAlign = textAlignSelect.value;
            ctx.direction = 'rtl';
            ctx.textBaseline = 'top';
            ctx.textRendering = 'optimizeLegibility'; // تحسين قراءة النص
            
            // تحديد نقطة البداية للنص بناءً على المحاذاة
            let xPosition;
            switch (textAlignSelect.value) {
                case 'right':
                    xPosition = (canvas.width / scaleFactor) - padding;
                    break;
                case 'center':
                    xPosition = (canvas.width / scaleFactor) / 2;
                    break;
                case 'left':
                    xPosition = padding;
                    break;
                default:
                    xPosition = (canvas.width / scaleFactor) - padding;
            }
            
            // تقسيم النص إلى أسطر
            const text = textInput.value;
            const lineHeight = fontSizePx * 1.5;
            const words = text.split(' ');
            let line = '';
            let yPos = padding;
            
            // رسم النص سطراً بسطر
            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                const testWidth = ctx.measureText(testLine).width;
                
                if (testWidth > containerWidth && i > 0) {
                    ctx.fillText(line, xPosition, yPos);
                    line = words[i] + ' ';
                    yPos += lineHeight;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, xPosition, yPos);
            
            // تحويل الـ canvas إلى URL للتنزيل - تحسين جودة التصدير
            try {
                // استخدام جودة أعلى للصورة (1.0 تعني أعلى جودة)
                const dataUrl = canvas.toDataURL('image/png', 1.0);
                const downloadLink = document.createElement('a');
                downloadLink.href = dataUrl;
                downloadLink.download = 'saudi-font-text.png';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } catch (error) {
                console.error("خطأ في تنزيل الصورة:", error);
                alert("حدث خطأ أثناء محاولة إنشاء الصورة. يرجى المحاولة مرة أخرى.");
            }
        });
    }
    
    // تحسين دالة downloadUsingHtml2Canvas أيضًا إذا كنت تستخدمها كحل بديل
    function downloadUsingHtml2Canvas() {
        if (!textInput.value.trim()) {
            alert("الرجاء إدخال نص قبل التنزيل");
            return;
        }
        
        const html2canvasScript = document.createElement('script');
        html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        html2canvasScript.onload = function() {
            // تحسين خيارات html2canvas للحصول على جودة أعلى
            const options = {
                scale: 2, // معامل تكبير لزيادة الدقة
                useCORS: true, // للسماح بتحميل الموارد من مصادر مختلفة
                allowTaint: true,
                backgroundColor: bgColorPicker.value,
                logging: false
            };
            
            html2canvas(outputContainer, options).then(canvas => {
                const dataUrl = canvas.toDataURL('image/png', 1.0);
                const downloadLink = document.createElement('a');
                downloadLink.href = dataUrl;
                downloadLink.download = 'saudi-font-text.png';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            });
        };
        document.body.appendChild(html2canvasScript);
    }
    
    // ربط الأحداث
    textInput.addEventListener('input', updateOutput);
    fontStyleSelect.addEventListener('change', updateFontStyle);
    fontSizeSlider.addEventListener('input', updateFontSize);
    textColorPicker.addEventListener('input', updateTextColor);
    bgColorPicker.addEventListener('input', updateBgColor);
    textAlignSelect.addEventListener('change', updateTextAlign);
    downloadBtn.addEventListener('click', downloadAsImage);
    
    // ضبط الحالة الأولية
    updateFontStyle();
    updateFontSize();
    updateTextColor();
    updateBgColor();
    updateTextAlign();
});