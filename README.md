# メシズム messism
ベーステンプレート

## 基本仕様
- 文字コード：UTF-8（BOM無し）
- 改行コード：LF
- レイアウト：レスポンシブウェブデザイン

### 動作保証環境
| OS | ブラウザ |
|:--|:--|
| Windows | Internet Explorer 11<br>FireFox<br>Google Chrome |
| Mac OS | Safari<br>FireFox<br>Google Chrome |
| iOS 9+ | Safari |
| Android 4.4+ | Google Chrome |

※バージョンの記述がないものは最新版を対象とする。

## 開発環境
| 種別 | 使用ツール |
|:--|:--|
| タスクランナー | gulp |
| CSS | Sass(Scss記法) |
| AltJS | なし（webpackでの結合処理あり） |
| HTML | ejs |   

### インストール

node/gulp/bundleが事前にインストールされている必要がある。

    $ npm install
    $ bower install
    $ bundle install

## タスクランナー
- ローカルサーバー / オートリロード / ファイル監視
- ejsのコンパイル
- Sassのコンパイル・プレフィックスの付与・圧縮
- JavaScriptの結合・圧縮・コピー
- 画像圧縮
- hologramを実行してスタイルガイド作成

## リソースの構成・命名規則

### ディレクトリ構造

- [ dev ] 開発環境
  - [ inc ] インクルード系ファイル
  - [ src ] 各ソースファイル
    - [ xxx ] 各ディレクトリ毎のソース・ファイル
  - [ xxx ] 各ページディレクトリ
- [ hologram ] hologram生成元
- [ release ] リリース用出力先

### 命名規則

- 半角英数字（ A-Z a-z 0-9 ）から構成する。
- 単語の区切りはローワーキャメルケースで表す。
- 原則として英単語を使用する。
- 固有名詞・サービス名に使われているなどの理由で日本語を使用する場合には、ヘボン式ロー
マ字で記述する。

    [パーツ名]_[機能・説明]_[連番].[拡張子]

パーツ名：
- ico - アイコン画像
- bg - 背景画像
- thumbs - サムネイル画像
- btn - ボタン画像
- img - 写真・画像

## HTML設計

### パス記述方式・リンクルール
- ルート相対パスを使用。末尾のindex.htmlは省略する。
- 遷移先がサイト内コンテンツのリンクにはtarget属性を指定しない。
- 遷移先が別ドメインのリンクにはtarget属性に `_blank` を指定する。

### Webフォント

| サービス名 | 使用フォント | 
| :-- | :-- |
| Google Fonts | Open Sans |

#### Base font-family
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Kaku Gothic ProN', '游ゴシック Medium', meiryo, 'Open Sans', sans-serif;

#### Serif font-family
    font-family: "Hiragino Mincho ProN", "Hiragino Mincho Pro", "游明朝", YuMincho, "ＭＳ 明朝", serif;

## CSS設計

### CSSファイルの定義
- common.css - 全拠点全ページ共通で読み込むファイル。
- styleguide.css - スタイルガイド用のファイル。

### SCSSファイルの定義

### 基本ルール
- ECSSに準じる。
- スタイルの定義にはクラスを用いて、IDは使用しない。
- 詳細度が無闇に高くならないように留意する。
- レスポンシブはモバイルファーストで記述する。

以下は保守性に悪影響を及ぼすため、極力使用を避けること。
- CSSハック
- !important
- HTMLにstyle属性でスタイルを記述

### 記述ルール
- 数値が `0` の場合、単位を省略する。
- 数値が `0.x` の場合、0を省略して `.x` とする。
- カラーコードは小文字英数字を使用した16進数で記述する。省略できるカラーコードは略記を使用する。（ex: #000000 → #000）
- Sassの過剰なネストを避ける。
- プロパティの記述順序はCSScombを利用して整理する。

### 命名規則
- 単語の区切りはローワーキャメルケースで表し、エレメントの区切り文字には `_` を、モディファイアの区切り文字には `-` を使用する。（ex: globalNavigation_item-current）
- 単語の省略は行わない。（ex: btn → button、nav → navigation）
- 一部のクラスには接頭辞をつける。
  - `is-` 状態を表すクラス。単体では使用されない。JavaScriptを使用して状態が変わるものなどに使用。
  - `js-` JavaScriptの呼び出し用。原則、このクラスにはスタイルを付加しない。

### パフォーマンス向上
- 無闇にショートハンドを使用しない。とくに `margin` 、 `padding` 、 `background` は必要以上にスタイルの上書きが発生しないように気をつけて記述する。
- レイアウトには `flexbox` を使用し、 `float` の使用を避ける。
- 要素の移動には `transform` を使用し、 `position` の使用を避ける。

### ブレイクポイント

## JavaScript設計

### 利用ライブラリ
- jQuery

### JavaScriptファイルの定義

###　基本ルール
- 処理を細かにモジュール化し、シンプルでわかりやすい構造にする。
- パフォーマンスに気をつける。VanilaJSで済む場所はVanilaJSで。（無闇にjQueryを使わない）

