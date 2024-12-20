export default getTransition;

/**
 * @param {keyof import('@mui/material').Theme["transitions"]["duration"]} duration
 * @param {Array<"margin" | "width">} targets
 */
function getTransition(duration, ...targets) {
    /** @param {import('@mui/material').Theme} theme */
    return theme => ({
        transition: theme.transitions.create(targets, {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration[duration],
        }),
    });
}
