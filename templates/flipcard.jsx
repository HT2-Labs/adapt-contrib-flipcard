import React from 'react';
import { templates, classes, html, compile } from 'core/js/reactHelpers';

export default function flipcard(props) {
  const {
    displayTitle,
    body,
    instruction
  } = props;

  return (
    <div
      className='component__inner flipcard__inner' 
      role='region'
    >

      <templates.header {...props} />

      <div className='component__widget flipcard__widget clearfix'>

        {props._items.map(({ backBody, backTitle, frontImage, _flipDirection }, index) =>
          
          <div 
            className={classes([
              `component__item flipcard__item item-${index} ${_flipDirection}`,
            ])}
            aria-labelledby={(displayTitle, body, instruction)}
            key={index}
            tabIndex='0'
          >
            <div
              className='flipcard__item-face flipcard__item-front'>
              <img
                className='flipcard__item-frontImage'
                src={frontImage.src}
                aria-label={frontImage.alt}>
              </img>
            </div>

            <div
              className='flipcard__item-face flipcard__item-back'
              aria-labelledby={(backTitle, backBody)}
              role='button'
            >
              {backTitle &&
                <div
                  className='flipcard__item-back-title'
                  aria-hidden='true'
                  aria-live='polite'
                >
                {html(compile(backTitle))}
                </div>
              }

              {backBody &&
                <div
                  className='flipcard__item-back-body'
                  aria-hidden='true'
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