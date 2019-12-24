const setRandomSolution = (params) => {
    const solutionIndex = Math.floor(Math.random() * solutions.length);
    params.set("solution", solutionIndex)
    window.location.href = window.location.href.split("?")[0] + "?" + params.toString()
}

const params = new URLSearchParams(window.location.search)
const solutionIndex = params.get("solution")
const solution = solutionIndex && solutionIndex < solutions.length ?
    solutions[solutionIndex] :
    setRandomSolution(params)