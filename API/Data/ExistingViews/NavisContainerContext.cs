
using Microsoft.EntityFrameworkCore;

namespace API.Data.ExistingViews;

public partial class NavisContainerContext : DbContext
{
    public NavisContainerContext()
    {
    }

    public NavisContainerContext(DbContextOptions<NavisContainerContext> options)
        : base(options)
    {
    }


    //  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
    //    => optionsBuilder.UseSqlServer("Server=172.22.10.200;Trust Server Certificate=True;Database=BGTNAVISAPIDB;User Id=awafa;Password=a7561;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<CtypeFinalInvoice>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("CTypeFinalInvoices");

            entity.Property(e => e.Currency).HasMaxLength(30);
            entity.Property(e => e.CustomerName).HasMaxLength(100);
            entity.Property(e => e.Final).HasMaxLength(30);
            entity.Property(e => e.FinalDate).HasColumnType("datetime");
            entity.Property(e => e.InvoiceType).HasMaxLength(3);
        });

        modelBuilder.Entity<InvoiceCustomer>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("InvoiceCustomers");

            entity.Property(e => e.ConsigneeId)
                .HasMaxLength(90)
                .IsUnicode(false)
                .HasColumnName("ConsigneeID");
            entity.Property(e => e.ConsigneeName).IsUnicode(false);
            entity.Property(e => e.Role).HasMaxLength(50);
            entity.Property(e => e.SapCode).HasMaxLength(50);
        });

        modelBuilder.Entity<InvoiceItemsDetail>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("InvoiceItemsDetails");

            entity.Property(e => e.ChargeableUnitEvent).HasMaxLength(50);
            entity.Property(e => e.ContainerId).HasMaxLength(30);
            entity.Property(e => e.CustomerName).HasMaxLength(80);
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.GlCode).HasMaxLength(40);
            entity.Property(e => e.InvoiceCreatedDate).HasColumnType("datetime");
            entity.Property(e => e.InvoiceFinalNumber).HasMaxLength(30);
            entity.Property(e => e.InvoiceFinalizedDate).HasColumnType("datetime");
            entity.Property(e => e.Notes).HasMaxLength(1000);
        });

        modelBuilder.Entity<InvoiceUnitFacilityVisitBerth>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("InvoiceUnitFacilityVisitBerths");

            entity.Property(e => e.Berth).HasMaxLength(255);
            entity.Property(e => e.CreateTime).HasColumnType("datetime");
            entity.Property(e => e.TransitState).HasMaxLength(255);
            entity.Property(e => e.VisitState).HasMaxLength(255);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
