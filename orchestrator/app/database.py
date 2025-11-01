from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import get_settings

settings = get_settings()

# Convert postgresql:// to postgresql+asyncpg:// for async operations
database_url = settings.database_url
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+asyncpg://", 1)

engine = create_async_engine(
    database_url,
    echo=True,
    future=True,
    pool_pre_ping=True,  # Validate connections before use
    pool_recycle=3600,   # Recycle connections every hour
    connect_args={
        "ssl": False,  # Disable SSL for internal cluster connections
        "command_timeout": 60,  # 60 second command timeout
        "server_settings": {
            "jit": "off"  # Disable JIT for better connection stability
        }
    } if database_url.startswith("postgresql") else {}
)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()