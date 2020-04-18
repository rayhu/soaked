import _ from "lodash"

const settings = _.extend(
    {
        pipesObj: "cached_pipes_object",
    },
    window.$ui_configuration,
)

export default settings
