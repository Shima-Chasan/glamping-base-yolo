// メインJavaScriptファイル

// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', function() {
    // CMSのお知らせデータを読み込む
    loadNewsData();
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
            // デフォルトの送信動作を防止しない
            // e.preventDefault(); を削除して通常のフォーム送信を許可
            
            const formStatus = document.getElementById('form-status');
            
            // 送信中メッセージを表示
            if (formStatus) {
                formStatus.textContent = '送信中...';
                formStatus.classList.remove('hidden', 'text-red-500', 'text-green-500');
                formStatus.classList.add('text-gray-500');
            }
            
            // フォーム送信は通常のブラウザの送信処理に任せる
            // Netlifyが自動的に処理してくれる
            
            // エラーハンドリングは必要ない
            // 成功時はフォームのaction属性に指定したページにリダイレクトされる
        });
    }
});
