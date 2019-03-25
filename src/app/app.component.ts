import { Component } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {NgbProgressbarConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NgbProgressbarConfig] // add the NgbProgressbarConfig to the component providers
})
export class AppComponent {


  public text  : any ;
  public JSONData : any;
  public  headers:any[] = [];
  public  result :any[] = [];
  public closeResult: string;
  public PreviewArray: any[] = [];

  constructor(private modalService: NgbModal , private config: NgbProgressbarConfig) {

        // customize default values of progress bars used by this component tree
        config.max = 1000;
        config.striped = true;
        config.animated = true;
        config.type = 'success';
        config.height = '20px';
  }



 // Open Modal 
  open(content) {
    this.modalService.open(content, { size: "lg"} ).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.ResetImport();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.ResetImport();
    });
  }




  // Close Modal
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  private dismiss(reason: any){
    console.log(reason);
  }



// Where The Magic Happen
  public csvJSON(csvText) {

   let lines = csvText.split('\n');

   this.headers = lines[0].split(',');

   for ( let i = 1; i < lines.length - 1 ; i++) {

       let obj = {};
       let currentline = lines[i].split(',');

       for (var j = 0; j < this.headers.length; j++) {
           obj[this.headers[j]] = currentline[j];
       }

       this.result.push(obj);

   }
  
   console.log(JSON.stringify(this.result)); // JSON
   this.JSONData = JSON.stringify(this.result);

   this.genPreviewArray( this.result );

}




// gen Sample Preview Table   
 public  genPreviewArray = (src:any[]) => {

    for (let i = 0; i < 20; ++i) {
     
      this.PreviewArray.push(src[i]);
      this.PreviewArray[i].concourID = "25";
    }

 }


//Call the Convert Function When The File was selected
 convertFile(input) {
 const reader = new FileReader();
 reader.readAsText(input.files[0]);
 reader.onload = () => {
   let text = reader.result;
   this.text = text;
   //before conversion
   console.log(text);
   this.csvJSON(text);
 };

}

// Reset Everything When The Modal was Closed To Improve Performance
public ResetImport = () => {

  if( this.PreviewArray.length > 0 ){
    this.text  = '' ;
    this.JSONData = '';

    this.empty(this.headers);
    this.empty(this.result);
    this.empty(this.PreviewArray);

 console.log('Import was Reset');
  }
 
}


//Empty any array
private  empty(list:any[]) {
    //empty your array
    list.length = 0;
}



}
