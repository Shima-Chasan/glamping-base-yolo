// メインJavaScriptファイル

// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', function() {
    // モバイルメニューの切り替え
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // FAQのアコーディオン機能
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // 現在のアンサー要素を取得
            const answer = question.nextElementSibling;
            
            // アイコンを取得
            const icon = question.querySelector('i');
            
            // アンサーの表示/非表示を切り替え
            answer.classList.toggle('hidden');
            
            // アイコンを切り替え
            if (icon) {
                if (answer.classList.contains('hidden')) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                } else {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            }
        });
    });
    
    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // ナビゲーションバーの高さを考慮
                    behavior: 'smooth'
                });
                
                // モバイルメニューが開いている場合は閉じる
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    // Netlify Formsの送信処理
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const formStatus = document.getElementById('form-status');
            
            // 実際のNetlify Formsの送信処理
            fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                contactForm.reset();
                if (formStatus) {
                    formStatus.textContent = 'お問い合わせありがとうございます。担当者から連絡いたします。';
                    formStatus.classList.remove('hidden', 'text-red-500');
                    formStatus.classList.add('text-green-500');
                }
            })
            .catch((error) => {
                if (formStatus) {
                    formStatus.textContent = '送信中にエラーが発生しました。後ほど再度お試しください。';
                    formStatus.classList.remove('hidden', 'text-green-500');
                    formStatus.classList.add('text-red-500');
                }
                console.error(error);
            });
        });
    }
});
