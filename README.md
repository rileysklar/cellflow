# CellFlow - Manufacturing Efficiency Tracking System

CellFlow is a modern web application designed to track and optimize manufacturing efficiency in industrial production facilities. It provides real-time monitoring of machine cycles, identifies bottlenecks, measures cycle times, and enables dynamic adjustments to production standards.

## Features

- 📊 Real-time efficiency monitoring
- 🏭 Multi-level tracking (Company, Site, Value Stream, Cell)
- 👥 Role-based access control
- 📈 Performance analytics and reporting
- ⚡ WebSocket-based live updates
- 🔄 Background job processing
- 📱 Responsive design

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- ShadcN UI
- Clerk Authentication
- Socket.io Client

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- WebSockets
- BullMQ

### Infrastructure
- Docker & Docker Compose
- Fly.io Deployment
- GitHub Actions CI/CD

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- pnpm
- Docker & Docker Compose
- PostgreSQL 15

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/cellflow.git
cd cellflow
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
# Frontend (.env.local)
cp apps/frontend/.env.example apps/frontend/.env.local
# Add your Clerk keys

# Backend (.env)
cp apps/backend/.env.example apps/backend/.env
# Add your database credentials
\`\`\`

4. Start the development environment:
\`\`\`bash
# Start all services
docker-compose up -d

# Start frontend development server
pnpm dev
\`\`\`

5. Visit http://localhost:3000 to see the application

## Project Structure

\`\`\`
/apps
  /frontend               # Next.js frontend
  /backend                # FastAPI backend
  /docs                   # Documentation
/libs
  /shared                 # Shared types and utilities
  /api                    # API client and schemas
  /database              # Database setup and models
/services
  /worker                # Background job processing
\`\`\`

## Development Workflow

1. Create a new branch for your feature:
\`\`\`bash
git checkout -b feature/your-feature-name
\`\`\`

2. Make your changes and commit using conventional commits:
\`\`\`bash
git commit -m "feat: add new efficiency calculation"
\`\`\`

3. Push your changes and create a pull request:
\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

## Authentication Levels

- **Company & Site**: Locked upon sign-up
- **Value Stream & Cell**: Can be switched within the app
- **Roles**:
  - Admin/Supervisor: Full access
  - Operator: Limited to assigned areas

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@cellflow.com or join our Slack channel. 