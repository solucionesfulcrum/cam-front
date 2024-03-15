import { Component} from '@angular/core';

@Component({
  selector: 'esp-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.scss']
})
export class AdmissionComponent{
  links=[
    {url:'/app/admission', title:'Ficha de admisión'},
    {url:'/app/admission/citas', title:'Citas'},
    // {url:'/app/admission/turnos', title:'Turnos'},
  ]
}
