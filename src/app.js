/**
 * Workflow Form Application
 * Main JavaScript file for the workflow form application
 */

// ============================================
// Global Variables
// ============================================
let DOCUMENT_TYPES = {};
let WEBHOOK_CONFIG = { url: '', token: '' };

// ============================================
// Configuration Loading
// ============================================
/**
 * Load settings from config.json
 */
async function loadSettings() {
    try {
        const response = await fetch('config.json');
        const settings = await response.json();
        DOCUMENT_TYPES = settings.documentTypes || {};
        WEBHOOK_CONFIG = settings.webhook || { url: '', token: '' };
        return true;
    } catch (error) {
        console.error('設定ファイルの読み込みに失敗しました:', error);
        // デフォルト設定を使用
        DOCUMENT_TYPES = {};
        WEBHOOK_CONFIG = { url: '', token: '' };
        console.warn('config.jsonが見つかりません。デフォルト設定を使用します。');
        return true;
    }
}

/**
 * Initialize forms after loading settings
 */
async function initializeForms() {
    const loaded = await loadSettings();
    if (!loaded) return;
    
    generateDocumentCheckboxes();
    generateCommonForm();
    generateDocumentForms();
    setDefaultDate();
    updateSubmitButton();
}

// ============================================
// Form Generation
// ============================================
/**
 * Generate document selection checkboxes
 */
function generateDocumentCheckboxes() {
    const documentList = document.getElementById('documentList');
    documentList.innerHTML = '';
    
    let index = 1;
    for (const [docType, docConfig] of Object.entries(DOCUMENT_TYPES)) {
        const item = document.createElement('div');
        item.className = 'document-item';
        item.innerHTML = `
            <input type="checkbox" id="doc${index}" value="${docType}" data-form="${docConfig.formId}">
            <label for="doc${index}">${docConfig.name}</label>
        `;
        documentList.appendChild(item);
        index++;
    }

    // チェックボックスの変更を監視
    document.querySelectorAll('#documentList input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateFormVisibility();
            updateSubmitButton();
        });
    });
}

/**
 * Generate common information form
 */
function generateCommonForm() {
    const commonForm = document.getElementById('common-form');
    commonForm.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label for="common-date">作成日</label>
                <input type="date" id="common-date" name="common-date" class="common-field">
            </div>
        </div>
        <div class="party-section">
            <h3>当事者A</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="common-party1-name">氏名・名称</label>
                    <input type="text" id="common-party1-name" name="common-party1-name" class="common-field" placeholder="例: 株式会社○○ または 山田 太郎">
                </div>
                <div class="form-group">
                    <label for="common-party1-address">住所</label>
                    <input type="text" id="common-party1-address" name="common-party1-address" class="common-field" placeholder="例: 東京都渋谷区...">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="common-party1-contact">連絡先</label>
                    <input type="text" id="common-party1-contact" name="common-party1-contact" class="common-field" placeholder="例: TEL: 03-1234-5678">
                </div>
            </div>
        </div>
        <div class="party-section">
            <h3>当事者B</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="common-party2-name">氏名・名称</label>
                    <input type="text" id="common-party2-name" name="common-party2-name" class="common-field" placeholder="例: 株式会社△△ または 佐藤 花子">
                </div>
                <div class="form-group">
                    <label for="common-party2-address">住所</label>
                    <input type="text" id="common-party2-address" name="common-party2-address" class="common-field" placeholder="例: 東京都新宿区...">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="common-party2-contact">連絡先</label>
                    <input type="text" id="common-party2-contact" name="common-party2-contact" class="common-field" placeholder="例: TEL: 03-9876-5432">
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate document-specific forms
 */
function generateDocumentForms() {
    const documentForms = document.getElementById('document-forms');
    documentForms.innerHTML = '';

    for (const [docType, docConfig] of Object.entries(DOCUMENT_TYPES)) {
        const formSection = document.createElement('div');
        formSection.id = docConfig.formId;
        formSection.className = 'form-section';

        let formHTML = `<h3 style="margin-bottom: 15px; color: #667eea;">${docConfig.name}の追加情報</h3>`;

        docConfig.fields.forEach(field => {
            if (field.type === 'textarea') {
                formHTML += `
                    <div class="form-group">
                        <label for="${field.name}">${field.label}</label>
                        <textarea id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ''}"></textarea>
                    </div>
                `;
            } else {
                formHTML += `
                    <div class="form-group">
                        <label for="${field.name}">${field.label}</label>
                        <input type="${field.type}" id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ''}">
                    </div>
                `;
            }
        });

        formSection.innerHTML = formHTML;
        documentForms.appendChild(formSection);
    }
}

// ============================================
// Form UI Updates
// ============================================
/**
 * Update form visibility based on selected documents
 */
function updateFormVisibility() {
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });

    document.querySelectorAll('#documentList input[type="checkbox"]:checked').forEach(checkbox => {
        const formId = checkbox.getAttribute('data-form');
        const formSection = document.getElementById(formId);
        if (formSection) {
            formSection.classList.add('active');
        }
    });
}

/**
 * Update submit button state
 */
function updateSubmitButton() {
    const checkedBoxes = document.querySelectorAll('#documentList input[type="checkbox"]:checked');
    const submitBtn = document.getElementById('submitBtn');
    
    if (checkedBoxes.length > 0) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

/**
 * Set default date to today
 */
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('common-date');
    if (dateInput) {
        dateInput.value = today;
    }
}

// ============================================
// Data Collection & Formatting
// ============================================
/**
 * Format date to Japanese format
 */
function formatDateToJapanese(dateString) {
    if (!dateString) return '__________';
    const date = new Date(dateString + 'T00:00:00');
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

/**
 * Get common data from form
 */
function getCommonData() {
    const commonData = {};
    document.querySelectorAll('.common-field').forEach(input => {
        if (input.name) {
            if (input.type === 'date') {
                commonData[input.name] = formatDateToJapanese(input.value);
                commonData[input.name + '_raw'] = input.value;
            } else {
                commonData[input.name] = input.value;
            }
        }
    });
    return commonData;
}

// ============================================
// Webhook Integration
// ============================================
/**
 * Send data to PowerAutomate webhook
 */
async function sendToWebhook() {
    const resultContent = document.getElementById('resultContent');
    const resultSection = document.getElementById('resultSection');
    const submitBtn = document.getElementById('submitBtn');
    
    // Webhook URLのチェック
    if (!WEBHOOK_CONFIG.url) {
        alert('Webhook URLが設定されていません。設定タブで設定してください。');
        return;
    }
    
    // 共通情報を取得
    const commonData = getCommonData();
    
    // 選択された書類のデータを収集
    const selectedDocuments = [];
    
    document.querySelectorAll('#documentList input[type="checkbox"]:checked').forEach(checkbox => {
        const docType = checkbox.value;
        const formId = checkbox.getAttribute('data-form');
        const formSection = document.getElementById(formId);
        const docConfig = DOCUMENT_TYPES[docType];
        
        if (!docConfig) return;
        
        // 個別フィールドデータを収集
        const specificData = {};
        formSection.querySelectorAll('input, textarea, select').forEach(input => {
            if (input.name) {
                specificData[input.name] = input.value;
            }
        });
        
        selectedDocuments.push({
            type: docType,
            name: docConfig.name,
            config: docConfig,
            data: specificData
        });
    });
    
    if (selectedDocuments.length === 0) {
        alert('書類を選択してください。');
        return;
    }
    
    // 送信データを構築
    const payload = {
        token: WEBHOOK_CONFIG.token || '',
        timestamp: new Date().toISOString(),
        common: commonData,
        documents: selectedDocuments
    };
    
    // 送信ボタンを無効化
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';
    resultContent.textContent = 'PowerAutomateに送信中...';
    resultSection.classList.add('active');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    try {
        const response = await fetch(WEBHOOK_CONFIG.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json().catch(() => ({ message: '送信成功' }));
        
        resultContent.textContent = `✅ 送信成功\n\n送信時刻: ${new Date().toLocaleString('ja-JP')}\n選択された書類: ${selectedDocuments.map(d => d.name).join(', ')}\n\nレスポンス:\n${JSON.stringify(responseData, null, 2)}`;
        submitBtn.textContent = 'PowerAutomateに送信';
        
        // フォームをクリア（オプション）
        if (confirm('送信が完了しました。フォームをクリアしますか？')) {
            clearForm();
        }
        
    } catch (error) {
        console.error('送信エラー:', error);
        resultContent.textContent = `❌ 送信エラー\n\nエラー内容: ${error.message}\n\n送信データ:\n${JSON.stringify(payload, null, 2)}`;
        submitBtn.textContent = 'PowerAutomateに送信';
    } finally {
        submitBtn.disabled = false;
    }
}

/**
 * Clear form fields
 */
function clearForm() {
    document.querySelectorAll('input[type="text"], input[type="date"], textarea').forEach(input => {
        if (!input.classList.contains('common-field') || input.id === 'common-date') {
            // 共通フィールドの日付のみクリア
            if (input.id === 'common-date') {
                const today = new Date().toISOString().split('T')[0];
                input.value = today;
            }
        } else if (input.classList.contains('common-field')) {
            // 共通フィールドは保持
            return;
        } else {
            input.value = '';
        }
    });
    
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    updateFormVisibility();
    updateSubmitButton();
    
    const resultSection = document.getElementById('resultSection');
    resultSection.classList.remove('active');
}

// ============================================
// Tab Management
// ============================================
/**
 * Switch between tabs
 */
function switchTab(tabName, eventElement) {
    // すべてのタブを非表示
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    // 選択されたタブを表示
    document.getElementById(`${tabName}-tab`).classList.add('active');
    if (eventElement) {
        eventElement.classList.add('active');
    } else {
        // onclick属性から呼ばれた場合
        const buttons = document.querySelectorAll('.nav-tab');
        buttons.forEach(btn => {
            if (btn.textContent.includes(tabName === 'form' ? 'フォーム' : '設定')) {
                btn.classList.add('active');
            }
        });
    }

    // 設定タブに切り替えた場合は設定を読み込む
    if (tabName === 'settings') {
        loadSettingsForEditor();
    }
}

// ============================================
// Settings Editor
// ============================================
/**
 * Load settings for the editor
 */
function loadSettingsForEditor() {
    // Webhook設定を反映
    document.getElementById('webhook-url').value = WEBHOOK_CONFIG.url || '';
    document.getElementById('webhook-token').value = WEBHOOK_CONFIG.token || '';

    // 書類タイプを表示
    renderDocumentTypes();
}

/**
 * Render document types in the editor
 */
function renderDocumentTypes() {
    const container = document.getElementById('document-types-container');
    container.innerHTML = '';

    for (const [docType, docConfig] of Object.entries(DOCUMENT_TYPES)) {
        const item = document.createElement('div');
        item.className = 'document-type-item';
        item.id = `doc-type-${docType}`;

        let fieldsHTML = '';
        docConfig.fields.forEach((field, index) => {
            fieldsHTML += `
                <div class="field-item" data-field-index="${index}">
                    <div class="form-row">
                        <div class="form-group">
                            <label>フィールド名</label>
                            <input type="text" class="field-name" value="${field.name}" placeholder="field-name">
                        </div>
                        <div class="form-group">
                            <label>ラベル</label>
                            <input type="text" class="field-label" value="${field.label}" placeholder="ラベル">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>タイプ</label>
                            <select class="field-type">
                                <option value="text" ${field.type === 'text' ? 'selected' : ''}>テキスト</option>
                                <option value="textarea" ${field.type === 'textarea' ? 'selected' : ''}>テキストエリア</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>プレースホルダー</label>
                            <input type="text" class="field-placeholder" value="${field.placeholder || ''}" placeholder="例: 入力してください">
                        </div>
                    </div>
                    <button class="btn btn-danger" onclick="removeField('${docType}', ${index})" style="margin-top: 10px;">フィールドを削除</button>
                </div>
            `;
        });

        item.innerHTML = `
            <h3 style="margin-bottom: 15px; color: #667eea;">${docConfig.name}</h3>
            <div class="form-group">
                <label>書類名</label>
                <input type="text" class="doc-name" value="${docConfig.name}" placeholder="契約書">
            </div>
            <div class="form-group">
                <label>Form ID</label>
                <input type="text" class="doc-form-id" value="${docConfig.formId}" placeholder="contract-form">
            </div>
            <div style="margin-top: 15px;">
                <strong>フィールド</strong>
                <div id="fields-${docType}">
                    ${fieldsHTML}
                </div>
                <button class="btn btn-primary" onclick="addField('${docType}')" style="margin-top: 10px;">フィールドを追加</button>
            </div>
            <button class="btn btn-danger" onclick="removeDocumentType('${docType}')" style="margin-top: 15px;">書類タイプを削除</button>
        `;

        container.appendChild(item);
    }
}

/**
 * Add field to document type
 */
function addField(docType) {
    const fieldsContainer = document.getElementById(`fields-${docType}`);
    const fieldIndex = fieldsContainer.children.length;
    const fieldItem = document.createElement('div');
    fieldItem.className = 'field-item';
    fieldItem.setAttribute('data-field-index', fieldIndex);
    fieldItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>フィールド名</label>
                <input type="text" class="field-name" value="" placeholder="field-name">
            </div>
            <div class="form-group">
                <label>ラベル</label>
                <input type="text" class="field-label" value="" placeholder="ラベル">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>タイプ</label>
                <select class="field-type">
                    <option value="text">テキスト</option>
                    <option value="textarea">テキストエリア</option>
                </select>
            </div>
            <div class="form-group">
                <label>プレースホルダー</label>
                <input type="text" class="field-placeholder" value="" placeholder="例: 入力してください">
            </div>
        </div>
        <button class="btn btn-danger" onclick="removeField('${docType}', ${fieldIndex})" style="margin-top: 10px;">フィールドを削除</button>
    `;
    fieldsContainer.appendChild(fieldItem);
}

/**
 * Remove field from document type
 */
function removeField(docType, index) {
    const fieldsContainer = document.getElementById(`fields-${docType}`);
    const fieldItems = fieldsContainer.querySelectorAll('.field-item');
    if (fieldItems[index]) {
        fieldItems[index].remove();
    }
}

/**
 * Add new document type
 */
function addDocumentType() {
    const newType = `doc-${Date.now()}`;
    DOCUMENT_TYPES[newType] = {
        name: '新規書類',
        formId: 'new-form',
        fields: []
    };
    renderDocumentTypes();
}

/**
 * Remove document type
 */
function removeDocumentType(docType) {
    if (confirm(`「${DOCUMENT_TYPES[docType].name}」を削除しますか？`)) {
        delete DOCUMENT_TYPES[docType];
        renderDocumentTypes();
    }
}

// ============================================
// Settings Save
// ============================================
/**
 * Save webhook settings
 */
function saveWebhookSettings() {
    WEBHOOK_CONFIG.url = document.getElementById('webhook-url').value;
    WEBHOOK_CONFIG.token = document.getElementById('webhook-token').value;
    saveAllSettings();
    showAlert('Webhook設定を保存しました。', 'success');
}

/**
 * Save document types
 */
function saveDocumentTypes() {
    // UIから書類タイプを収集
    const newDocumentTypes = {};
    document.querySelectorAll('.document-type-item').forEach(item => {
        const docType = item.id.replace('doc-type-', '');
        const nameInput = item.querySelector('.doc-name');
        const formIdInput = item.querySelector('.doc-form-id');
        const fieldsContainer = item.querySelector('[id^="fields-"]');

        if (!nameInput || !formIdInput) return;

        const fields = [];
        fieldsContainer.querySelectorAll('.field-item').forEach(fieldItem => {
            const name = fieldItem.querySelector('.field-name')?.value;
            const label = fieldItem.querySelector('.field-label')?.value;
            const type = fieldItem.querySelector('.field-type')?.value;
            const placeholder = fieldItem.querySelector('.field-placeholder')?.value;

            if (name && label) {
                fields.push({ name, label, type, placeholder });
            }
        });

        if (nameInput.value && formIdInput.value) {
            newDocumentTypes[docType] = {
                name: nameInput.value,
                formId: formIdInput.value,
                fields: fields
            };
        }
    });

    DOCUMENT_TYPES = newDocumentTypes;
    saveAllSettings();
    showAlert('書類タイプを保存しました。ページを再読み込みして反映してください。', 'success');
}

/**
 * Save all settings to file
 */
function saveAllSettings() {
    const settings = {
        webhook: WEBHOOK_CONFIG,
        documentTypes: DOCUMENT_TYPES
    };

    // JSONファイルをダウンロード
    const jsonStr = JSON.stringify(settings, null, 2);
    const jsonBlob = new Blob([jsonStr], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonA = document.createElement('a');
    jsonA.href = jsonUrl;
    jsonA.download = 'config.json';
    document.body.appendChild(jsonA);
    jsonA.click();
    document.body.removeChild(jsonA);
    URL.revokeObjectURL(jsonUrl);
}

/**
 * Show alert message
 */
function showAlert(message, type) {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    container.innerHTML = '';
    container.appendChild(alert);

    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// ============================================
// Initialization
// ============================================
// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeForms();
});

