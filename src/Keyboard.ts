export default class Keyboard{



    constructor(){
        this.invokeWindowListener();
    }

    invokeWindowListener(): void{
        window.addEventListener('keypress', (evt) => {
            console.log(evt);
        })
    }
    


}