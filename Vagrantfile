Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"
  config.vm.provider "virtualbox" do |vb|
    vb.gui = false
    vb.memory = "1024"
    vb.cpus = 1
    vb.customize ["modifyvm", :id, "--audio", "none"]
  end

  # Gateway VM
  config.vm.define "gateway-vm" do |gateway|
    gateway.vm.network "private_network", ip: "192.168.56.10"
    gateway.vm.synced_folder ".", "/home/vagrant/app", type: "rsync",
      rsync__exclude: [
        "src/billing-app/",
        "src/inventory-app/",
        "scripts/billing-app/",
        "scripts/inventory-app/",
        ".git/",
        "node_modules/"
      ]
    gateway.vm.provision "shell", path: "scripts/gateway-app/setup-gateway.sh"
    gateway.vm.post_up_message = "Gateway VM started successfully!"
    gateway.vm.boot_timeout = 600
  end

  # Inventory VM
  config.vm.define "inventory-vm" do |inventory|
    inventory.vm.network "private_network", ip: "192.168.56.11"
    inventory.vm.synced_folder ".", "/home/vagrant/app", type: "rsync",
      rsync__exclude: [
        "src/billing-app/",
        "src/api-gateway/",
        "scripts/billing-app/",
        "scripts/gateway-app/",
        ".git/",
        "node_modules/"
      ]
    inventory.vm.provision "shell", path: "scripts/inventory-app/setup-inventory.sh"
    inventory.vm.post_up_message = "Inventory VM started successfully!"
    inventory.vm.boot_timeout = 600
  end

  # Billing VM
  config.vm.define "billing-vm" do |billing|
    billing.vm.network "private_network", ip: "192.168.56.12"
    billing.vm.synced_folder ".", "/home/vagrant/app", type: "rsync",
      rsync__exclude: [
        "src/inventory-app/",
        "src/api-gateway/",
        "scripts/inventory-app/",
        "scripts/gateway-app/",
        ".git/",
        "node_modules/"
      ]
    billing.vm.provision "shell", path: "scripts/billing-app/setup-billing.sh"
    billing.vm.post_up_message = "Billing VM started successfully!"
    billing.vm.boot_timeout = 600
  end
end