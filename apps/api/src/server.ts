import buildApp from "./app";

const app = await buildApp()

app.addHook("onReady", async () => {
  app.log.info(`\n ${app.printRoutes()}`);
});

const port = Number(process.env.PORT ?? 8787);
app.listen({ port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
