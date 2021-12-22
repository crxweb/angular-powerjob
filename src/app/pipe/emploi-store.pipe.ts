import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "contratTypeLabel"
})

export class EmploiStorePipe implements PipeTransform {


  transform(value: string, desc: string = "", showDetails: boolean = false, oe:any = null/*, args?: any*/): any {
    let label = "";
    let labelColor = "default";

    switch (value) {
      case "CCE":
        //label = '<div class="label-main"><label class="label label-primary">'+value+'</label></div>';
        labelColor = "primary";
        break;
      case "CDD":
        //label = '<label class="label label-info text-spacing-2">'+value+'</label> <span class="text-muted bottom">'+desc+"</span";
        labelColor = "info";
        break;
      case "CDI":
        //label = '<label class="label label-success text-spacing-2">'+value+'</label>';
        labelColor = "success";
        break;
      case "CDS":
        //label = '<div class="label-main"><label class="label label-default">'+value+'</label></div>';
        labelColor = "default";
        break;
      case "CDU":
        //label = '<div class="label-main"><label class="label label-danger">'+value+'</label></div>';
        labelColor = "danger";
        break;
      case "CNE":
        //label = '<div class="label-main"><label class="label label-inverse">'+value+'</label></div>';
        labelColor = "inverse";
        break;
      case "DDI":
        //label = '<div class="label-main"><label class="label label-inverse-default">'+value+'</label></div>';
        labelColor = "inverse-default";
        break;
      case "FRA":
        //label = '<div class="label-main"><label class="label label-inverse-primary">'+value+'</label></div>';
        labelColor = "inverse-primary";
        break;
      case "INT":
        //label = '<div class="label-main"><label class="label label-inverse-success">'+value+'</label></div>';
        labelColor = "inverse-success";
        break;
      case "LIB":
        //label = '<div class="label-main"><label class="label label-inverse-info">'+value+'</label></div>';
        labelColor = "inverse-info";
        break;
      case "MIS":
        //label = '<div class="label-main"><label class="label label-warning">'+value+'</label></div>';
        labelColor = "warning";
        break;
      case "REP":
        //label = '<div class="label-main"><label class="label label-inverse-warning">'+value+'</label></div>';
        labelColor = "inverse-warning";
        break;
      case "SAI":
        //label = '<div class="label-main"><label class="label label-inverse-danger">'+value+'</label></div>';
        labelColor = "inverse-danger";
        break;
      case "TTI":
        //label = '<div class="label-main"><label class="label label-inverse-info-border">'+value+'</label></div>';
        labelColor = "inverse-info-border";
        break;
      default:
        //label = '<div class="label-main"><label class="label label-default">'+value+'</label></div>';
        labelColor = "default";
      break;
    }

    if(showDetails){
      if(oe){

        if(oe.hasOwnProperty("contractNatureName")){
          value = value + " | " + oe.contractNatureName;
          desc = "";
        }
      }
    }
    //label = '<label class="label label-'+labelColor+' text-spacing-2">'+value+'</label> <span class="text-muted bottom">'+desc+"</span>";
    label = '<span style="text-align:center;" class="badge badge-'+labelColor+' text-spacing-2">'+value+'</span> <span class="text-muted bottom">'+desc+"</span>";
    return label;
  }

}
