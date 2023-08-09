import { Template } from "./template";

export { };

const parentMenuId = "temput_menu_parent";
let templates: Array<Template> = [];

chrome.runtime.onInstalled.addListener(() => {
    // インストール時に親アイテム作成
    chrome.contextMenus.create({
        title: "お気に入り貼り付け",
        contexts: ['editable'],
        id: parentMenuId,
    });

    // 初回インストール後はストレージのonChangeイベントが発火しないため1回だけ子アイテム追加
    chrome.storage.local.get("templates", function (value) {
        templates = Object.values(value.templates) as Template[];
        createMenuItem(templates);
    })

    // アイテムクリック時のイベント登録
    chrome.contextMenus.onClicked.addListener(onClick);

    // ストレージの変更時のイベント登録
    chrome.storage.local.onChanged.addListener((changes) => {
        if (changes.templates.oldValue != undefined) {
            removeMenuItem(changes.templates.oldValue as Template[]);
        }
        if (changes.templates.newValue != undefined) {
            createMenuItem(changes.templates.newValue as Template[]);
        }
        templates = changes.templates.newValue;
    });
});

function onClick(info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) {
    if (!info.editable) {
        return;
    }
    if (tab == undefined) {
        return;
    }

    // content-script.tsに送信
    chrome.tabs.sendMessage(
        tab.id as number,
        templates.find((t) => t.id === info.menuItemId)?.value
    ).catch((e) => { console.error(`[temput] send context-script error: ${e}`) })
}

function createMenuItem(templates: Template[]) {
    let isFavoriteEmpty = true;
    for (const template of templates) {
        if (template.isFavorite) {
            isFavoriteEmpty = false;
            chrome.contextMenus.create({
                title: `#${template.id.split("-")[0]} ${template.name}`,
                id: template.id,
                contexts: ['editable'],
                parentId: parentMenuId
            });
        }
    }

    // お気に入りが一つもない場合は親アイテムを無効化する
    if (isFavoriteEmpty) {
        chrome.contextMenus.update(parentMenuId, { enabled: false });
    } else {
        chrome.contextMenus.update(parentMenuId, { enabled: true });
    }
}

function removeMenuItem(templates: Template[]) {
    for (const template of templates) {
        if (template.isFavorite) {
            chrome.contextMenus.remove(template.id);
        }
    }
}
