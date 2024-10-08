"""empty message

Revision ID: fef0e5f0fcf7
Revises: 23461a7610be
Create Date: 2024-08-06 13:22:57.570772

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fef0e5f0fcf7'
down_revision = '23461a7610be'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('movie_states', schema=None) as batch_op:
        batch_op.add_column(sa.Column('title', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('image_path', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('movie_states', schema=None) as batch_op:
        batch_op.drop_column('image_path')
        batch_op.drop_column('title')

    # ### end Alembic commands ###
