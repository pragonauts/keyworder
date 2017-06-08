# Keyworder - Intent prediction form PrgChatbot

Predict user intents with cool machine learning tool, Facebook FastText.

## Preparing the model

1. Install Facebook [FastText](https://github.com/facebookresearch/fastText)
2. Follow [instructions](https://github.com/facebookresearch/fastText/blob/master/tutorials/supervised-learning.md)

## Using with Prg-Chatbot

Usage

```javascript
const { Router } = require('prg-chatbot');
const keyworder = require('keyworder');
const path = require('path');

keyworder.setResolver({
    model: path.join(process.cwd(), 'models', 'model.bin')
});

const app = new Router();

app.use(keyworder('hello'), (req, res, postBack, next) => {
    res.text('Hello too!');
});

```

-----------------

# API
## Functions

<dl>
<dt><a href="#keyworder">keyworder(tag, [threshold], [namespace])</a> ⇒ <code>function</code></dt>
<dd><p>Create resolver middleware for PrgChatbot</p>
</dd>
<dt><a href="#setResolver">setResolver(configuration, [namespace])</a></dt>
<dd></dd>
<dt><a href="#resolve">resolve(text, [threshold], [namespace])</a> ⇒ <code>Promise.&lt;{tag:string, score:number}&gt;</code></dt>
<dd><p>Resolve single text</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Configuration">Configuration</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="keyworder"></a>

## keyworder(tag, [threshold], [namespace]) ⇒ <code>function</code>
Create resolver middleware for PrgChatbot

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | tag for matching |
| [threshold] | <code>number</code> | override success threshold |
| [namespace] | <code>string</code> | resolver namespace |

**Example**  
```javascript
const keyworder = require('keyworder');

router.use(keyworder('hello-intent'), (req, res) => {
    res.text('Welcome too!');
});
```
<a name="setResolver"></a>

## setResolver(configuration, [namespace])
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| configuration | [<code>Configuration</code>](#Configuration) | the resolver configuration |
| [namespace] | <code>string</code> | set resolver for diferent namespace |

**Example**  
```javascript
const keyworder = require('keyworder');
const path = require('path');

keyworder.setResolver({
    model: path.join(__dirname, 'model.bin')
});
```
<a name="resolve"></a>

## resolve(text, [threshold], [namespace]) ⇒ <code>Promise.&lt;{tag:string, score:number}&gt;</code>
Resolve single text

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | query text |
| [threshold] | <code>number</code> | override the threshold |
| [namespace] | <code>string</code> | use other than default resolver |

<a name="Configuration"></a>

## Configuration : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| model | <code>string</code> | path to trained fast text model |
| threshold | <code>number</code> | prediction threshold (0.95 recommended) |
| cacheSize | <code>number</code> | keep this amount of results cached |
| filter | <code>function</code> | text preprocessor |
| logger | <code>function</code> | resolver logger function |

