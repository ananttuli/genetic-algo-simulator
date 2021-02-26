const config = {
    // Movement and Coordinates
    MOVE_SIZE: 3,
    STARTING_COORDS: [80, 80],
    MAX_STEPS: 300,



    // Environment and policy configuration
    NUM_TADPOLES: 300,
    DEATH_PENALTY: 3,
    REWARD_FACTOR: 0.75,
    REWARD: [20, 20],
    OBSTACLES: [[50, 50], [45, 55], [55, 5], [10, 90]],
    MUTATION_RATE: 0.01,
    MAX_GENERATIONS: 10,
    MAX_MAINTAIN_DIRECTION_STEPS: 5,


    // Game configuration
    WIDTH: 800,
    HEIGHT: 500,
    // Time interval between tadpole movement
    LOGIC_TICK: 50,
};

export default config;