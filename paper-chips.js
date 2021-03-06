/**
A list of chips that an be dynamically added/removed. This element can be used
to let users enter a list of topics or names.

### Example

```html
<paper-chips items=[[array]]></paper-chips>
```

### Items

The items given via the `items` property can have these properties:

Property | Description
---------|-------------
`id`     | Unique identification of the item (required)
`name`   | Display name of the item
`fixed`  | Boolean to indicate whether this item can be removed (`fixed` is `false`) or not (`fixed` is `true`)

@demo demo/chips.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-styles/default-theme.js';
import './paper-chip.js';
import './paper-chip-icons.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
Polymer({
    is: 'paper-chips',
    _template: html`
      <style>
        .chip {
          margin-right: 5px;
          padding-right: 6px;
          vertical-align: middle;
        }
        .chip:not([has-no-image]) {
          --paper-chip: {
            padding: 0 12px 0 0;
            overflow: hidden;
          }
        }

        img {
          width: 32px;
          height: 32px;
          border-radius: 0 50% 50% 0;
          vertical-align: middle;
          margin-right: 4px;
        }
        .image-spacer {
          margin-left: 12px;
        }

        .delete {
          --iron-icon-height: 20px;
          --iron-icon-width: 20px;
          color: var(--disabled-text-color);
        }

        .chip[selectable]:hover .delete {
          color: black;
        }

        [hidden] {
          display: none;
        }
      </style>

      <template is="dom-repeat" items="[[items]]">
        <paper-chip
          class="chip"
          selectable$="[[!item.fixed]]"
          has-no-image$="[[!item.image]]">
          <img src="[[_defaultToEmpty(item.image)]]" hidden$="[[!item.image]]" />
          [[item.name]]
          <iron-icon
            icon="paper-chip:[[_getIcon(item)]]"
            class="delete"
            on-tap="_delete"
          ></iron-icon>
        </paper-chip>
      </template>
  `,
    properties: {
				/**
				* Fired when the user deletes an item
				*
				* @event delete-item
				*/

				/**
				* Array of chips
				*
				* ```js
				* [
				*  { id: 'apples', name: 'Apples', image:'apple.jpg' },
				*  { id: 'pears', name: 'Pears', image:'pear.jpg'},
				*  { id: 'bananas', name: 'Bananas', fixed: true}
				* ]
				* ```
				*/
				items: {
            type: Array,
            notify: true,
            value: []
				},

				/**
				* True if no items are currently known
				*/
				empty: {
            type: Boolean,
            notify: true,
            computed: '_computeEmpty(items.length)'
				}
    },

    /**
    * Adds a chip
    */
    add: function(item) {
				// Only chips with a visible name
				if (typeof item.name === 'undefined' || item.name === '')  {
            return;
				}

				// Needs to use Polymer push to trigger data binding
				this.push('items', item);
    },

    /**
    * Removes a chip
    *
    * Note that this will also remove chips marked as 'fixed'.
    */
    remove: function(itemIndex) {
				const removedItemId = this.items[itemIndex].id;

				// Needs to use Polymer splice to trigger data binding
				this.splice('items', itemIndex, 1);

				this.fire('delete-item', {
            itemId: removedItemId,
				});
    },

    /**
    * Removes the last chip
    *
    * Note that this will also remove chips marked as 'fixed'.
    */
    removeLast: function() {
				// Ignore if there are no chips left
				if (this.items.length === 0) {
            return;
				}

				this.remove(this.items.length - 1);
    },

    /**
    * Handles clicks on the delete icon
    */
    _delete: function(e) {
				if (e.model.item.fixed) {
            // Cannot delete fixed items.
            return;
				}

				var itemIndex = this.items.indexOf(e.model.item);
				if (itemIndex > -1) {
            this.remove(itemIndex);
				}
    },

    _computeEmpty: function(nrItems) {
				return nrItems === 0;
    },

    /**
     * Default string to empty.
     * URLs should be set to undefined as this leads to a 404 network request.
     */
    _defaultToEmpty: function(str) {
				return str || '';
    },

    _getIcon: function(item) {
				return item.fixed ? 'lock' : 'cancel';
    }
});
