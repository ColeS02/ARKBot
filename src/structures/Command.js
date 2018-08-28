class Command {
  constructor() {
    this.name = 'unknown';
    this.displayName = 'unknown';
    this.description = 'unknown';
    this.fullDescription = 'unknown';
  }

  async process({ response, commandArguments, processingStartTime }) {
    let commandProcessTime = new Date().getTime();
    let processTime = (new Date().getTime() - processingStartTime);
    let executionResponse = this.execute({ response, commandArguments, processTime, commandProcessTime }).catch((error) => console.log(error));

    return executionResponse;
  }
}

module.exports = Command;
