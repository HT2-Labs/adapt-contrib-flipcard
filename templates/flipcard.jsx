import Adapt from 'core/js/adapt';
import React from 'react';
import { templates, classes, html, compile } from 'core/js/reactHelpers';

export default function flipcard(props) {
  const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    _flipType,
    _flipTime,
    displayTitle,
    body,
    instruction
  } = props;

  return (
    <div
      className='flipcard__inner component__inner' 
      role='region'
      aria-label='_globals._components._flipcard.ariaRegion'
    >

      <templates.header {...props} />

      <div className='flipcard__widget component__widget clearfix'>

        {props._items.map(({ _index, backBody, backTitle, frontImage, _flipDirection }, index) =>
          
          <div 
            className={classes([
              `flipcard__item component__item item-${index} ${_flipDirection}`,
            ])}
            aria-labelledby={(displayTitle || body || instruction)}
            key={_index}
          >
            <div className='flipcard__item-face flipcard__item-front'>
              <img
                className='flipcard__item-frontImage'
                src={frontImage.src} 
                aria-label={frontImage.alt}>
              </img>
            </div>

          <div className='flipcard__item-face flipcard__item-back'>

            {backTitle &&
              <div 
                className='flipcard__item-back-title'
                aria-live='polite'
              >
              {html(compile(backTitle))}
              </div>
            }

            {backBody &&
              <div 
                className='flipcard__item-back-body'
                aria-live='polite'
              >
              {html(compile(backBody))}
              </div>
            }

          </div>
          </div>

        )}
      </div>

    </div>
  );
}