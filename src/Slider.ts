export default class Slider{

    private endSlider: HTMLElement
    private offset: number
    private halfSliderWidth: number
    private startSlider: HTMLElement
    private active = false;
    private sliderDivRect: any



    constructor(){
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
                }
            }
        
            
            if(evt.target === this.endSlider ){    
                    const x = evt.clientX - this.offset - 22;
                 
                    if (x > parseInt(this.startSlider.style.left) && x <= this.sliderDivRect.width - this.halfSliderWidth) {
                        const left = evt.clientX - this.offset - 20 + 'px';
                        evt.target.style.left = left;
                    }
            }
        }
        
    }

}