/****************************************************************************
**
** Copyright (C) 2010 Matsukei Co.,Ltd.
**
** This program is free software: you can redistribute it and/or modify
** it under the terms of the GNU General Public License as published by
** the Free Software Foundation, either version 3 of the License, or
** (at your option) any later version.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program.  If not, see <http://www.gnu.org/licenses/>.
**
****************************************************************************/

#include <QtGui>
#include <QtWebKit>
#include <QDir>
#include <QFontDatabase>
#include <QFileInfo>
#include <QCryptographicHash>
#include "platform.h"

Platform::Platform(QWidget *parent)
    : QMainWindow(parent)
{
    QByteArray uid = QCryptographicHash::hash(QDir::homePath().toLocal8Bit(),
                                              QCryptographicHash::Md5);
    QFileInfo app("../core/application.html?uid=" + uid.toHex());

    if (!isDebugMode() && !app.exists()) {
        QMessageBox::critical(this, tr("ThinReportsEditor Platform Booting Error"),
                              "Unable to load application.");
        exit(0);
    }

    // Load built-in fonts.
    loadFonts();

    view = new QWebView(this);
    view->load(app.absoluteFilePath());

    setting();

    connect(view, SIGNAL(loadFinished(bool)), this, SLOT(init()));
    connect(view->page()->mainFrame(), SIGNAL(javaScriptWindowObjectCleared()),
            this, SLOT(populateJavaScript()));
    connect(view->page(), SIGNAL(windowCloseRequested()), this, SLOT(windowCloseRequested()));
    connect(view, SIGNAL(linkClicked(QUrl)), this, SLOT(openUrl(QUrl)));

    setCentralWidget(view);
    resize(1000, 700);
}

void Platform::loadFonts()
{
    QDirIterator it("../resources/fonts");
    while (it.hasNext()) {
        it.next();
        if (it.fileInfo().completeSuffix().toLower() == "ttf") {
            QFontDatabase::addApplicationFont(it.filePath());
        }
    }
}

bool Platform::isDebugMode()
{
    if (QApplication::argc() > 1) {
        QString arg = QApplication::argv()[1];
        return arg == "-d";
    }
    return false;
}

void Platform::setting()
{
    setAttribute(Qt::WA_InputMethodEnabled, true);

    view->setMinimumWidth(800);
    view->setMinimumHeight(600);

    QWebSettings *settings = view->settings();

    settings->setDefaultTextEncoding("utf-8");
    settings->setAttribute(QWebSettings::LocalStorageEnabled, true);
    settings->setLocalStoragePath(QDir::currentPath());

    view->page()->setLinkDelegationPolicy(QWebPage::DelegateExternalLinks);

    if (!isDebugMode()) {
    // Production Only.
        view->setAcceptDrops(false);
        view->setContextMenuPolicy(Qt::PreventContextMenu);
    } else {
    // Debug only
        settings->setAttribute(QWebSettings::DeveloperExtrasEnabled, true);
    }
}

void Platform::init()
{
    setWindowTitle(view->title());
    setFocus();
}

void Platform::populateJavaScript()
{
    view->page()->mainFrame()
            ->addToJavaScriptWindowObject("__treFileUtils__", new JsExtFile(this));
    view->page()->mainFrame()
            ->addToJavaScriptWindowObject("__treFontUtils__", new JsExtFont(this));
    view->page()->mainFrame()
            ->addToJavaScriptWindowObject("__treImageUtils__", new JsExtImage(this));

    QStringList initScript;
    initScript
            << "(function(){"
            << "  var utils = {"
            << "    File: window.__treFileUtils__, "
            << "    Font: window.__treFontUtils__, "
            << "    Image: window.__treImageUtils__"
            << "  };"
            << "  window.platform = utils;"
            << "  delete window.__treFileUtils__;"
            << "  delete window.__treFontUtils__;"
            << "  delete window.__treImageUtils__;"
            << "})();";
    view->page()->mainFrame()
            ->evaluateJavaScript(initScript.join(""));
}

void Platform::windowCloseRequested()
{
    close();
}

void Platform::openUrl(QUrl url)
{
    QDesktopServices::openUrl(url);
}

void Platform::closeEvent(QCloseEvent *evClose)
{
    QStringList beforeScript;
    beforeScript
            << "(function(){"
            << "  if (typeof window.onbeforeclose == 'function') {"
            << "    return window.onbeforeclose.call(this);"
            << "  } else {"
            << "    return true;"
            << "  }"
            << "})();";

    QVariant result = view
                      ->page()
                      ->mainFrame()
                      ->evaluateJavaScript(beforeScript.join(""));

    if (result.toBool() == true) {
        evClose->accept();
    } else {
        evClose->ignore();
    }
}