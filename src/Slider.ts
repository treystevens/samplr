import Trigger from './Trigger';

export default class Slider{

    private active: boolean
    private activeTrigger: Trigger
    private endSlider: HTMLElement
    private halfSliderWidth: number
    private offset: number
    private sliderDivRect: any
    private startSlider: HTMLElement
    

    constructor(){
        this.active = false;
        this.startSlider = document.querySelector('.slider__handle--start');
        this.endSlider = document.querySelector('.slider__handle--end');

        const sliderDiv = document.querySelector('.slider');
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = sliderDiv.getBoundingClientRect();

        this.sliderDivRect = sliderDiv.getBoundingClientRect();

        // Get the width of the slider to position start and end slider
        this.halfSliderWidth = this.startSlider.offsetWidth / 2;

        this.offset = elemRect.left - bodyRect.left;

        this.startSlider.style.left = `${0 - (this.halfSliderWidth)}px`
        this.endSlider.style.left = `${this.sliderDivRect.width - (this.halfSliderWidth)}px`


        sliderDiv.addEventListener("touchstart", (evt) => this.dragStart(evt), false);
        sliderDiv.addEventListener("touchend", (evt) => this.dragEnd(evt), false);
        sliderDiv.addEventListener("touchmove", (evt) =>this.moveSlider(evt), false);

        sliderDiv.addEventListener("mousedown", (evt) => this.dragStart(evt), false);
        sliderDiv.addEventListener("mouseup",(evt) => this.dragEnd(evt), false);
        sliderDiv.addEventListener("mousemove", (evt) =>this.moveSlider(evt), false);
    }


    dragStart(evt: Event) {
        if (evt.target === this.startSlider || evt.target === this.endSlider) {
          this.active = true;
        }
    }
    
    dragEnd(evt: Event) {
        this.active = false;
    }
    
    moveSlider(evt: any): void{    

        if(this.active){
            
            if(evt.target === this.startSlider ){
                
                const x = evt.clientX - this.offset - 22;

                if (x >= 0 - this.halfSliderWidth && x < parseInt(this.endSlider.style.left)) {
                   const left = evt.clientX - this.offset - 20 + 'px';
                   evt.target.style.left = left;
                   this.activeTrigger.setStartSliderPos(parseInt(left));
                }
            }
        
            
            if(evt.target === this.endSlider ){    
                    const x = evt.clientX - this.offset - 22;
                 
                    if (x > parseInt(this.startSlider.style.left) && x <= this.sliderDivRect.width - this.halfSliderWidth) {
                        const left = evt.clientX - this.offset - 20 + 'px';
                        evt.target.style.left = left;
                        this.activeTrigger.setEndSliderPos(parseInt(left));
                    }
            }
        }
        
    }


    setStartSlider(leftPos: number): void{
        this.startSlider.style.left = `${leftPos}px` ;
    }

    setEndSlider(leftPos: number): void{
        this.endSlider.style.left = `${leftPos}px` ;  
    }

    // Set the active trigger & set start and end slider from Trigger attributes
    setActiveTrigger(t: Trigger): void{
        this.activeTrigger = t;
        this.active = false;
        this.setStartSlider(this.activeTrigger.getStartSliderPos())
        this.setEndSlider(this.activeTrigger.getEndSliderPos());
    }
}