const express = require("express");
const bodyParser = require("body-parser");

const BasicRoutes = require("./routes/BasicRoutes");
const PublishRoutes = require("./routes/PublishRoutes");
const RoutingRoutes = require("./routes/RoutingRoutes");
const TopicRoutes = require("./routes/TopicRoutes");
const RPCRoutes = require("./routes/RPCRoutes");
const WorkRoutes = require("./routes/WorkRoutes");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use("/api/basic",BasicRoutes);
app.use("/api/publish", PublishRoutes);
app.use("/api/routing", RoutingRoutes);
app.use("/api/topic", TopicRoutes);
app.use("/api/rpc", RPCRoutes);
app.use("/api/work", WorkRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
