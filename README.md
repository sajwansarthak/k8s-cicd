# k8s-cicd-demo

Node.js (Express) app with a full CI/CD + GitOps pipeline:
**GitHub Actions -> Docker Hub -> Git manifest update -> Argo CD -> Minikube**

## Pipeline
1. Push to `main` triggers GitHub Actions (CI)
2. Run tests (Jest + Supertest)
3. Build Docker image, push to Docker Hub tagged with the commit SHA
4. Pipeline updates `k8s/deployment.yaml` with the new image tag and commits it
5. Argo CD (running in Minikube) detects the Git change and syncs the cluster automatically (CD)

## Run locally
    npm install && npm test && npm start

## Set up Minikube + Argo CD
    minikube start --driver=docker

    kubectl create namespace argocd
    kubectl apply -n argocd --server-side --force-conflicts \
      -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    kubectl -n argocd wait --for=condition=available deployment --all --timeout=300s

    # UI: https://localhost:8080  (user: admin)
    kubectl port-forward svc/argocd-server -n argocd 8080:443
    kubectl -n argocd get secret argocd-initial-admin-secret \
      -o jsonpath="{.data.password}" | base64 -d

## Connect Argo CD to this repo
Edit `argocd/application.yaml` (set `repoURL`), then:

    kubectl apply -f argocd/application.yaml
    minikube service k8s-cicd-demo --url

## Endpoints
- `GET /` - greeting, version, pod name
- `GET /health` - probe endpoint
- `GET/POST /api/tasks` - simple in-memory task list
