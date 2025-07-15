document.addEventListener('DOMContentLoaded', function() {
    // タブ要素の取得
    const reservationTab = document.getElementById('reservation-tab');
    const inquiryTab = document.getElementById('inquiry-tab');
    
    // フォームフィールドの取得
    const reservationFields = document.getElementById('reservation-fields');
    const inquiryFields = document.getElementById('inquiry-fields');
    const reservationMessageField = document.getElementById('reservation-message-field');
    const formTypeInput = document.getElementById('form-type');
    
    // 予約タブがクリックされたときの処理
    reservationTab.addEventListener('click', function() {
        // タブのスタイル変更
        reservationTab.classList.remove('bg-gray-200', 'text-gray-700');
        reservationTab.classList.add('bg-turquoise', 'text-white');
        inquiryTab.classList.remove('bg-turquoise', 'text-white');
        inquiryTab.classList.add('bg-gray-200', 'text-gray-700');
        
        // フィールドの表示/非表示
        reservationFields.classList.remove('hidden');
        inquiryFields.classList.add('hidden');
        reservationMessageField.classList.remove('hidden');
        
        // フォームタイプの設定
        formTypeInput.value = 'reservation';
        
        // 必須フィールドの設定
        toggleRequiredFields(true);
    });
    
    // お問い合わせタブがクリックされたときの処理
    inquiryTab.addEventListener('click', function() {
        // タブのスタイル変更
        inquiryTab.classList.remove('bg-gray-200', 'text-gray-700');
        inquiryTab.classList.add('bg-turquoise', 'text-white');
        reservationTab.classList.remove('bg-turquoise', 'text-white');
        reservationTab.classList.add('bg-gray-200', 'text-gray-700');
        
        // フィールドの表示/非表示
        reservationFields.classList.add('hidden');
        inquiryFields.classList.remove('hidden');
        reservationMessageField.classList.add('hidden');
        
        // フォームタイプの設定
        formTypeInput.value = 'inquiry';
        
        // 必須フィールドの設定
        toggleRequiredFields(false);
    });
    
    // 予約フィールドの必須属性を切り替える関数
    function toggleRequiredFields(isReservation) {
        const reservationRequiredFields = [
            document.getElementById('furigana'),
            document.getElementById('postal-code'),
            document.getElementById('address'),
            document.getElementById('check-in-date'),
            document.getElementById('check-in-time')
        ];
        
        const inquiryMessageField = document.getElementById('inquiry-message');
        
        if (isReservation) {
            // 予約モードの場合
            reservationRequiredFields.forEach(field => {
                if (field) field.required = true;
            });
            if (inquiryMessageField) inquiryMessageField.required = false;
        } else {
            // お問い合わせモードの場合
            reservationRequiredFields.forEach(field => {
                if (field) field.required = false;
            });
            if (inquiryMessageField) inquiryMessageField.required = true;
        }
    }
    
    // 初期状態は予約タブを選択状態にする
    reservationTab.click();
});
