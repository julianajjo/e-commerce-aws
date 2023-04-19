import * as cdk from "aws-cdk-lib"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as cwlogs from "aws-cdk-lib/aws-logs"
import { Construct } from "constructs"

//quando cria a classe ECommerceApiStack, passa as propriedade da interface abaixo, para que a classe tenha acesso às informações de produtos 
interface ECommerceApiStackProps extends cdk.StackProps {
   productsFetchHandler: lambdaNodeJS.NodejsFunction
}

//Já há um padrão de classe e construtor
export class ECommerceApiStack extends cdk.Stack {

   constructor(scope: Construct, id: string, props: ECommerceApiStackProps) {
      super(scope, id, props)

      //log group são como pastas que agrupam os arquivos de log
      const logGroup = new cwlogs.LogGroup(this, "ECommerceApiLogs")
      //há alguns tipos de api gateway que podemos criar, o rest api é um deles e é bem avançado,
      //e possui os recursos de validação que precisaremos no projeto
      const api = new apigateway.RestApi(this, "ECommerceApi", {
         //o nome abaixo é o que aparecerá no console do api gateway
         restApiName: "ECommerceApi",
         cloudWatchRole: true,
         deployOptions: {
            accessLogDestination: new apigateway.LogGroupLogDestination(logGroup), //aonde eu vou gerar os logs
            //abaixo está o formato da geração dos logs
            accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
               httpMethod: true,
               ip: true,
               protocol: true,
               requestTime: true,
               resourcePath: true,
               responseLength: true,
               status: true,
               caller: true,
               user: true
            })
         }
      })

      //integração para representar como o api gateway invocará aquela função (productsFetchHandler)
      const productsFetchIntegration = new apigateway.LambdaIntegration(props.productsFetchHandler)

      // "/products"
      const productsResource = api.root.addResource("products")
      productsResource.addMethod("GET", productsFetchIntegration)
   }
}
