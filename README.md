## AutoDAG -- Airflow Script Automation Tool

### in order to install

naviagate to extracted folder in terminal

type following command in terminal

chmod 777 autodag

./autodag

or

double click on autodag

## Airflow Script Automation Tool

This tool automates the creation of Apache Airflow workflows (DAGs), streamlining the process of defining, deploying, and maintaining complex data pipelines.

## Features

- **Dynamic DAG Generation**: Automatically creates DAGs based on external configuration files, reducing manual coding efforts.
- **Scalability**: Efficiently manages numerous workflows with similar patterns but varying parameters.
- **Maintainability**: Simplifies updates and modifications by adjusting configurations rather than altering code.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone git@github.com:5harath/AutoDAG.git
   ```


2. **Navigate to the Project Directory**:

   ```bash
   cd AutoDAG
   ```


3. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```


## Usage

1. **Prepare Configuration Files**: Store your DAG configurations in YAML format within the `configs/` directory.

2. **Run the Tool**: Execute the script to generate DAGs based on your configurations.

   ```bash
   python generate_dags.py
   ```


3. **Deploy to Airflow**: Move the generated DAG files to your Airflow DAGs directory.

   ```bash
   cp generated_dags/*.py /path/to/your/airflow/dags/
   ```


## Configuration File Structure

Each DAG is defined by a YAML configuration file. Below is an example structure:


```yaml
dag_id: example_dag
schedule: '@daily'
default_args:
  owner: 'airflow'
  start_date: '2025-01-01'
  retries: 1
tasks:
  - task_id: task_1
    python_callable: module.function_1
  - task_id: task_2
    python_callable: module.function_2
```


## Contributing

Contributions are welcome! Please fork the repository and submit a pull request. For major changes, open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

Special thanks to the Apache Airflow community for their extensive documentation and support.

For a visual demonstration and further insights into dynamic DAG generation, consider watching the following video:

[![Dynamically Generating DAGs in Airflow](https://img.youtube.com/vi/b-ZSnOZZdio/0.jpg)](https://www.youtube.com/watch?v=b-ZSnOZZdio) 
