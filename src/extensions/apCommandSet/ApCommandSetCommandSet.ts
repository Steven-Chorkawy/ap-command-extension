import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog as SPDialog, IPromptOptions } from '@microsoft/sp-dialog';

import * as strings from 'ApCommandSetCommandSetStrings';

import MyKendoDialog from './components/MyKendoDialog';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";

import './custom.css';


/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IApCommandSetCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'ApCommandSetCommandSet';



export default class ApCommandSetCommandSet extends BaseListViewCommandSet<IApCommandSetCommandSetProperties> {

  private _mapRows(selectedRows: any): void {
    selectedRows.map(row => {
      console.log('First Field:');
      console.log('getValue, index: 0');
      console.log(row.getValue(row.fields[0]));
      console.log('getValueByName: ID');
      console.log(row.getValueByName('ID'));
    });
  }

  private _RowAccessorToObject(selectedRows): Array<any> {
    let output = [];
    for (let rowIndex = 0; rowIndex < selectedRows.length; rowIndex++) {
      const row = selectedRows[rowIndex];
      let rowObject = {};
      for (let fieldIndex = 0; fieldIndex < row.fields.length; fieldIndex++) {
        const field = row.fields[fieldIndex];
        rowObject[field.internalName] = row.getValueByName(field.internalName);
      }
      output.push(rowObject);
    }
    return output;
  }

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized ApCommandSetCommandSet');

    sp.setup({
      spfxContext: this.context,
      sp: {
        headers: {
          "Accept": "application/json; odata=nometadata"
        },
        baseUrl: this.context.pageContext.web.absoluteUrl
      }
    });

    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    console.log('\n\nonListViewUpdated');
    console.log(event);
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      this._mapRows((event.selectedRows));
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = event.selectedRows.length === 1;
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    console.log('\n\nonExecute');
    console.log(event);
    switch (event.itemId) {
      case 'COMMAND_1':
        this._mapRows(event.selectedRows);
       

        break;
      case 'COMMAND_2':
        SPDialog.alert(`${this.properties.sampleTextTwo}`)
          .then(f => {
            sp.web.currentUser.get()
              .then(user => {
                console.log("Current User");
                console.log(user);
                console.log('current web');
                console.log(this.context.pageContext.site);
                console.log(window.location);
                sp.web.lists.getByTitle('Invoice Action Required').items
                  .filter(`AssignedToId eq ${user.Id}`)
                  .select('AR_x0020_Invoice_x0020_RequestId')
                  .get()
                  .then(actionsRequired => {
                    let invoiceIds = [];

                    actionsRequired.map(action => {
                      invoiceIds.push(action.AR_x0020_Invoice_x0020_RequestId);
                    });

                    console.log(invoiceIds);
                    var filteredArray = invoiceIds.filter(function (item, pos) {
                      return invoiceIds.indexOf(item) == pos;
                    });
                    console.log(filteredArray);

                    let queryString = '';
                    filteredArray.map(f => {
                      queryString.length > 0
                        ? queryString += `%3B%23${f}`
                        : queryString += `${f}`;
                    });

                    //91%3B%2392%3B%2393%3B%2394%3B%2395
                    
                    console.log(queryString);
                    let url = `${window.location.pathname}?FilterFields1=ID&FilterValues1=${queryString}&FilterTypes1=Counter&viewid=75519614%2Dee29%2D4659%2Db12d%2D0f0242cf0fa8`;
                    console.log(url);
                    window.location.href = url;
                  });
              });
          });
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
