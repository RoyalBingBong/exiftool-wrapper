## Functions

<dl>
<dt><a href="#metadata">metadata(options)</a> ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code></dt>
<dd><p>Returns the metadata of the given source. Returns a Promise or uses the passed callback.</p>
</dd>
<dt><a href="#metadataSync">metadataSync(options)</a> ⇒ <code>Array.&lt;object&gt;</code></dt>
<dd><p>Returns the metadata of the given source synchroniously.</p>
</dd>
</dl>

<a name="metadata"></a>

## metadata(options) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
Returns the metadata of the given source. Returns a Promise or uses the passed callback.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - A promise that contains the metadata for the media in an Array of Objects  
**Export**:   

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  |  |
| options.source | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> &#124; <code>Buffer</code> |  | The media for which we want to extract the metadata |
| [options.tags] | <code>Array.&lt;string&gt;</code> |  | List of metadata tags to whitelist or blacklist (add '-' before each tag). See [ExifTool Tag Names](http://www.sno.phy.queensu.ca/%7Ephil/exiftool/TagNames/index.html) for available tags. |
| [options.useBufferLimit] | <code>boolean</code> | <code>true</code> | Allows the limiting the size of the buffer that is piped into ExifTool |
| [options.maxBufferSize] | <code>number</code> | <code>10000</code> | Size of the buffer that is piped into ExifTool |
| [options.callback] | <code>metadataCallback</code> |  | Callback that receives the metadata |

<a name="metadataSync"></a>

## metadataSync(options) ⇒ <code>Array.&lt;object&gt;</code>
Returns the metadata of the given source synchroniously.

**Kind**: global function  
**Returns**: <code>Array.&lt;object&gt;</code> - An array of objects that contains the metadata for each media  
**Export**:   

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  |  |
| options.source | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> &#124; <code>Buffer</code> |  | The media for which we want to extract the metadata |
| [options.tags] | <code>Array.&lt;string&gt;</code> |  | List of metadata tags to whitelist or blacklist (add '-' before each tag). See [ExifTool Tag Names](http://www.sno.phy.queensu.ca/%7Ephil/exiftool/TagNames/index.html) for available tags. |
| [options.useBufferLimit] | <code>boolean</code> | <code>true</code> | Allows the limiting the size of the buffer that is piped into ExifTool |
| [options.maxBufferSize] | <code>number</code> | <code>10000</code> | Size of the buffer that is piped into ExifTool |

