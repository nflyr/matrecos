import { vjsx } from "../core/jsx-runtime";
/** @jsx vjsx */

/**
Component: templates/Card
File     : Card.jsx
Author   : nflyr (luisf.aff@gmail.com)
Licence  : EUPL
Versions :
 - 2023.07.05 (v1) - Initial version
 - aaaa.mm.dd (v?) - Description...

Implements the container for a monitorization card.
This component was built specifically for the "Monitor Server" platform (SC).

The principle beyond the card is that it wraps a distinct set of information
that belongs to a certain context/entity (DDD agregate) with full vertical 
isolation (crud, transform, render, etc.).

The card offers the following features:

- A title that labels it's purpose and data aggregate that it contains.
- A optional status icon to show some state.
- A days/hous/minutes label showing the aging of the body component (counts-back since last rendering).
- A body container rendered from the context/entity that was assigned to that specific card.

## Usage

A `Card` may be initally constructed with our without a body component.

The `Card` function has no required properties. However, if not passed, the following properties
will be created and assigned to the card:
- A unique `id` attribute assigned to the card's root element. Note: unique is: `document.getElementById(newid)===null`.
- A default `title` built by the following code: `"Card #" + newid`. 
- A default class attribute with value `"component card"` will be added if a `className` property is missing. 
- The text "no data" will be placed inside the card's body container.

The basic syntax is:
- Create: `const card = Card({id: "card-id", title: "The card title"});`
- Assign: `someDomElement.appendChild(card);`

## Properties

- `id` -
- `title` -
- `logo` - bookmars a icon in the icon-prite --> 'icon-sprite-001.svg#{logo}'
- `className` -
- `body` - A object created with `document.createElement(...)` to append on the body part of the component.

## Styling

@TODO, review this part...
 Card dimentions should be set by classes of type card-w-[s|m|l] and card-h-[s|m|l].
   - The container DIV has a fixed class of 'card'
   - The DIV that holds the logo and title has a fixed class of 'card-header'
   - The DIV that holds the data widget has a fixed class of 'card-body'
   - The SVG element of the logo can be mapped in css as '.card > div.card-header svg'
   - The H1 element of the title can be mapped in css as '.card > div.card-header h1'
*/
export function Card(props) {
  const id = props.id || "Card" + Math.floor(Math.random() * 1000);
  const logo = `#${props.logo ?? "icon-Stop"}`;
  return (
    <div id={id} class="template-card">
      <header id={`${id}_header`} class="template-card-title">
        <svg role="img">
          <use href={logo}></use>
        </svg>
        <h1>{props.title}</h1>
        <h2> </h2>
      </header>
      <div id={id + "_body"} class="template-card-body">
        {props.body}
      </div>
    </div>
  );
}

export default Card;
