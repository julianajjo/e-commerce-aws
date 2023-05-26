import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"

//Nova stack para a criação da tabela de eventos no Dynamo
export class EventsDdbStack extends cdk.Stack {
   readonly table: dynamodb.Table

   constructor(scope: Construct, 
      id: string, 
      props?: cdk.StackProps) {
      super(scope, id, props)

      this.table = new dynamodb.Table(this, 
         "EventsDdb", {
            tableName: "events",
            removalPolicy: cdk.RemovalPolicy.DESTROY, //Destrói a tabela qnd a stack é removida
            partitionKey: {
               name: "pk",
               type: dynamodb.AttributeType.STRING
            },
            sortKey: {
               name: "sk",
               type: dynamodb.AttributeType.STRING
            },
            timeToLiveAttribute: "ttl", //mecanismo de apagar o elemento no futuro
            billingMode: dynamodb.BillingMode.PROVISIONED,
            readCapacity: 1,
            writeCapacity: 1
         }) 
   }
}