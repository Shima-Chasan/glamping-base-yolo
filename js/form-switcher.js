/**
 * 予約フォームとお問い合わせフォームの切り替え処理
 * Netlify Forms用に完全に分離された2つのフォームを切り替えます
 * カード内タブ切り替え対応版
 */
document.addEventListener('DOMContentLoaded', function() {
    // フォームラッパーの取得
    const reservationWrapper = document.getElementById('reservation-wrapper');
    const contactWrapper = document.getElementById('contact-wrapper');
    
    // すべてのタブボタンを取得
    const reservationTab = document.getElementById('reservation-tab');
    const inquiryTab = document.getElementById('inquiry-tab');
    const reservationTabContact = document.getElementById('reservation-tab-contact');
    const inquiryTabContact = document.getElementById('inquiry-tab-contact');
    
    // 予約タブがクリックされたときの処理
    function showReservationForm() {
        // 予約カードのタブスタイル変更
        reservationTab.classList.remove('bg-gray-200', 'text-gray-700');
        reservationTab.classList.add('bg-turquoise', 'text-white');
        inquiryTab.classList.remove('bg-turquoise', 'text-white');
        inquiryTab.classList.add('bg-gray-200', 'text-gray-700');
        
        // お問い合わせカードのタブスタイル変更
        reservationTabContact.classList.remove('bg-gray-200', 'text-gray-700');
        reservationTabContact.classList.add('bg-turquoise', 'text-white');
        inquiryTabContact.classList.remove('bg-turquoise', 'text-white');
        inquiryTabContact.classList.add('bg-gray-200', 'text-gray-700');
        
        // フォームの表示/非表示
        reservationWrapper.classList.remove('hidden');
        contactWrapper.classList.add('hidden');
    }
    
    // お問い合わせタブがクリックされたときの処理
    function showContactForm() {
        // 予約カードのタブスタイル変更
        inquiryTab.classList.remove('bg-gray-200', 'text-gray-700');
        inquiryTab.classList.add('bg-turquoise', 'text-white');
        reservationTab.classList.remove('bg-turquoise', 'text-white');
        reservationTab.classList.add('bg-gray-200', 'text-gray-700');
        
        // お問い合わせカードのタブスタイル変更
        inquiryTabContact.classList.remove('bg-gray-200', 'text-gray-700');
        inquiryTabContact.classList.add('bg-turquoise', 'text-white');
        reservationTabContact.classList.remove('bg-turquoise', 'text-white');
        reservationTabContact.classList.add('bg-gray-200', 'text-gray-700');
        
        // フォームの表示/非表示
        reservationWrapper.classList.add('hidden');
        contactWrapper.classList.remove('hidden');
    }
    
    // タブクリックイベントの設定
    reservationTab.addEventListener('click', showReservationForm);
    reservationTabContact.addEventListener('click', showReservationForm);
    inquiryTab.addEventListener('click', showContactForm);
    inquiryTabContact.addEventListener('click', showContactForm);
    
    // 初期状態は予約タブを選択状態にする
    showReservationForm();
});
