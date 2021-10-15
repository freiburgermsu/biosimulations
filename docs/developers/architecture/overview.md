# Biosimulations Architecture

The BioSimulations/BioSimulators platform (BioSimulations) is a distributed computing system that is architected for extensibility, scalability, and ease of development. By separating the various components of the platform, we hope to enable developers to focus on relevant portions of the system and not on the details of the underlying architecture. In deciding which parts of the system should be separated, we try to balance the added complexity of distributed computing with clean separation of concerns. Details about the decisions and thought processes behind the architecture can be found in [Architecture Philosophy](./philosophy.md) page.

The components of the BioSimulations platform can be roughly organized as follows:

- Front-end applications
    - runBiosimulations
    - BioSimulations
    - BioSimulators 
- Public APIs
    - BioSimulations API
    - BioSimulators API
- Back-end services
    - Dispatch Service
    - COMBINE API  
- Data storage
    - Mongo Database
    - S3 Buckets 
- Computing infrastructure
    - GKE Kubernetes Cluster
    - Uconn HPC 