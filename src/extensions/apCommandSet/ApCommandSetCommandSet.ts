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
    const compareEditCommand: Command = this.tryGetCommand('COMMAND_EDIT');


    if (compareEditCommand) {
      compareEditCommand.visible = event.selectedRows.length === 1;
    }

    if (compareOneCommand) {
      compareOneCommand.visible = event.selectedRows.length > 0;
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
        sp.web.currentUser.get()
          .then(user => {
            console.log("Current User");
            console.log(user);
            console.log('current web');
            console.log(this.context.pageContext.site);
            console.log(window.location);

            // Getting Invoice Actions that are assigned to the current user and have a status of waiting.
            // This will get us a list of invoice request IDs that the user has not yet responded to.  
            sp.web.lists.getByTitle('Invoice Action Required').items
              .filter(`AssignedToId eq ${user.Id} and Response_x0020_Status eq 'Waiting'`)
              .select('AR_x0020_Invoice_x0020_RequestId')
              .get()
              .then(actionsRequired => {
                // This array will be used to filter the invoices later.
                let invoiceIds = [];

                // Convert the array of objects into an array of numbers.
                actionsRequired.map(action => {
                  invoiceIds.push(action.AR_x0020_Invoice_x0020_RequestId);
                });

                console.log(invoiceIds);

                // This filters out duplicate numbers. 
                // The reason this is done is to reduce the final length of our query string. 
                var filteredArray = invoiceIds.filter(function (item, pos) {
                  return invoiceIds.indexOf(item) == pos;
                });

                console.log(filteredArray);

                // Build the query filter that will be used in the URL. 
                let queryString = '';
                filteredArray.map(f => {
                  queryString.length > 0
                    ? queryString += `%3B%23${f}` // This is NOT the first ID we're adding.
                    : queryString += `${f}`;      // This IS the first ID we're adding.
                });

                console.log(queryString);

                // * Note that this does not work correctly while in the debug env, but it works in prod. 
                // TODO: Find out how to build a valid url in the debug env.
                let url = `${window.location.pathname}?FilterFields1=ID&FilterValues1=${queryString}&FilterTypes1=Counter&viewid=75519614%2Dee29%2D4659%2Db12d%2D0f0242cf0fa8`;

                console.log(url);

                window.location.href = url;
              });
          });
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
