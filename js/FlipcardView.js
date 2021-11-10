import ComponentView from 'coreViews/componentView';
import Adapt from 'coreJS/adapt';

class FlipcardView extends ComponentView {

  events() {
    return {
      'click .flipcard__item': 'onClickFlipItem',
      'keypress .flipcard__item-face': 'onClickFlipItem'
    };
  }

  // this is used to set ready status for current component on postRender.
  postRender() {
    const items = this.model.get('_items');
    const $items = this.$('.flipcard__item');

    if (!Modernizr.testProp('transformStyle', 'preserve-3d')) {
      this.$('.flipcard__item-back').hide();
    }

    // Width css class for single or multiple images in flipcard.
    const className = (items.length > 1) ? 'flipcard__multiple' : 'flipcard__single';
    $items.addClass(className);

    this.$('.flipcard__widget').imageready(() => {
      this.reRender();
      this.setReadyStatus();
    });
  }

  // This function called on triggering of device resize and device change event of Adapt.
  // It sets the height of the flipcard component to the first image in the component.
  reRender() {
    const $firstItemImage = this.$('.flipcard__item-frontImage').eq(0);
    const $items = this.$('.flipcard__item');
    const flexBasis = $items.length > 1 ? '49%' : '100%';

    // Reset width so that dimensions can be recalculated
    $items.css({ flexBasis: flexBasis });

    const imageHeight = Math.round($firstItemImage.height());
    const itemWidth = Math.floor($items.eq(0).outerWidth());

    if (imageHeight) {
      $items.height(imageHeight);
    }

    // Responsive margin to make horizontal and vertical gutters equal
    const gutterWidth = itemWidth * 0.04;

    $items.css({
      flexBasis: itemWidth,
      marginBottom: gutterWidth
    });
  }

  // Click or Touch event handler for flip card.
  onClickFlipItem(event) {
    this.isFlipped = true;
    if (event && event.target.tagName.toLowerCase() === 'a') {
      return;
    }

    event && event.stopImmediatePropagation();

    const $selectedElement = $(event.currentTarget);

    this.$('.flipcard__item').on('transitionend', () => {
      this.focusOnFlipcard($selectedElement);
      this.$('.flipcard__item').off('transitionend');
    });


    this.$selectedElement = $selectedElement;
    this.performFlip();
  }

  performFlip() {
    if (!Modernizr.testProp('transformStyle', 'preserve-3d')) {
      return this.performLegacyFlip();
    }

    if (this.model.get('_flipType') === 'singleFlip' && !this.$selectedElement.hasClass('flipcard__flip')) {
      const $items = $('.flipcard__item');
      flipcardContainer.find($items).removeClass('flipcard__flip');

      const itemToFlip = $items.parent().find('.flipcard__flip');
      if (!itemToFlip.length) return;

      this.focusOnFlipcard(itemToFlip, true);
    }

    this.$selectedElement.toggleClass('flipcard__flip');

    const flipcardElementIndex = this.$selectedElement.data('index');
    this.setVisited(flipcardElementIndex);
  }

  performLegacyFlip() {
    const $frontflipcard = this.$selectedElement.find('.flipcard__item-front');
    const $backflipcard = this.$selectedElement.find('.flipcard__item-back');
    const flipTime = this.model.get('_flipTime') || 'fast';

    const flipcardElementIndex = this.$selectedElement.data('index');
    this.setVisited(flipcardElementIndex);

    if ($backflipcard.is(':visible')) {
      $backflipcard.fadeOut(flipTime, () => {
        $frontflipcard.fadeIn(flipTime);
      });

      return;
    }

    if ($frontflipcard.is(':visible')) {
      $frontflipcard.fadeOut(flipTime, () => {
        $backflipcard.fadeIn(flipTime);
      });
    }

    if (this.model.get('_flipType') !== 'singleFlip') return;

    const flipcardContainer = this.$selectedElement.closest('.flipcard__widget');
    const visibleFlipcardBack = flipcardContainer.find('.flipcard__item-back:visible');

    if (visibleFlipcardBack.length) {
      visibleFlipcardBack.attr('aria-hidden', true);
      visibleFlipcardBack.fadeOut(flipTime, () => {
        flipcardContainer.find('.flipcard__item-front:hidden').fadeIn(flipTime);
      });

      this.focusOnFlipcard(visibleFlipcardBack.parents('.flipcard__item'), true);
    }
  }

  focusOnFlipcard($selectedElement, isSingleFlip = false) {
    const classFlipcardFront = '.flipcard__label-front';
    const classFlipcardBack = '.flipcard__label-back';
    const index = $selectedElement.data('index');
    const item = this.model.get('_items')[index];

    $selectedElement.removeAttr('aria-label');
    const isFlipped = $selectedElement.hasClass('flipcard__flip');

    let label = item.frontImage.alt

    if (isFlipped && !isSingleFlip) {
      label = item.backTitle + ' ' + $(item.backBody).text();
    }

    // is apple platform used to determine if voiceover is being used
    const isApplePlatform = (Adapt.device.isAppleDevice() || Adapt.device.getOperatingSystem() === 'mac');

    if (!isApplePlatform) {
      $selectedElement.attr('aria-label', label);

      if (isSingleFlip) return;
      $selectedElement.blur();
      Adapt.a11y.focusFirst($selectedElement);

      return;
    }

    Adapt.a11y.toggleHidden($selectedElement.find(classFlipcardFront), (isFlipped && !isSingleFlip));
    Adapt.a11y.toggleHidden($selectedElement.find(classFlipcardBack), (!isFlipped || isSingleFlip));

    if (isFlipped && !isSingleFlip) {
      $selectedElement.find(classFlipcardBack).attr('aria-label', label);
    } else {
      $selectedElement.find(classFlipcardFront).attr('aria-label', label);
    }

    if (isSingleFlip) return;
    const flipcardToFocus = isFlipped ? classFlipcardBack : classFlipcardFront;
    $selectedElement.blur();
    Adapt.a11y.focusFirst($selectedElement.find(flipcardToFocus));
  }

  // This function will set the visited status for particular flipcard item.
  setVisited(index) {
    const item = this.model.get('_items')[index];
    item._isVisited = true;
    this.model.checkCompletionStatus();
  }
}

export default FlipcardView;
