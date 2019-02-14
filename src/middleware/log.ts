export default async (ctx: any, next: Function) => {
  console.log(`start at ${Date.now()}`)
  await next()
}