import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs" //biblioteca utilizada para construir as stacks 
import * as lambda from "aws-cdk-lib/aws-lambda" //biblioteca utilizada para criar lambdas
import * as ssm from "aws-cdk-lib/aws-ssm" //é um recurso que auxilia em guardar parâmetros

export class ProductsAppLayersStack extends cdk.Stack {
   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props)

      const productsLayers = new lambda.LayerVersion(this, "ProductsLayer", {
         code: lambda.Code.fromAsset('lambda/products/layers/productsLayer'),
         compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
         layerVersionName: "ProductsLayer",
         removalPolicy: cdk.RemovalPolicy.RETAIN
      })
      new ssm.StringParameter(this, "ProductsLayerVersionArn", {
         parameterName: "ProductsLayerVersionArn",
         stringValue: productsLayers.layerVersionArn
      })

      const productEventsLayers = new lambda.LayerVersion(this, "ProductEventsLayer", {
         code: lambda.Code.fromAsset('lambda/products/layers/productEventsLayer'),
         compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
         layerVersionName: "ProductEventsLayer",
         removalPolicy: cdk.RemovalPolicy.RETAIN
      })
      new ssm.StringParameter(this, "ProductEventsLayerVersionArn", {
         parameterName: "ProductEventsLayerVersionArn",
         stringValue: productEventsLayers.layerVersionArn
      })
   }
}