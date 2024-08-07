"""Create a tv show state model.

Revision ID: 6b088341d727
Revises: fef0e5f0fcf7
Create Date: 2024-08-07 09:40:37.355067

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6b088341d727'
down_revision = 'fef0e5f0fcf7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tv_show_states',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('tv_show_id', sa.Integer(), nullable=False),
    sa.Column('state', sa.String(length=50), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=True),
    sa.Column('image_path', sa.String(length=255), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('tv_show_states')
    # ### end Alembic commands ###
